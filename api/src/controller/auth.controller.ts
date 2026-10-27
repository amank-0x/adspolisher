import type { Request, Response } from "express";
import { hashPassword } from "better-auth/crypto";
import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import prismaClient from "../config/db.js";
import jwt from "jsonwebtoken";
import { sendEmailResetLink } from "../utils/sendEmailMagicLink.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.js";
import { resetPasswordSchema, sendResetLinkSchema, resetPasswordOtpSchema } from "../types/auth.type.js";

const OTP_LIFETIME_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function resetSecret() {
    return process.env.MAGIC_LINK_SECRET || process.env.BETTER_AUTH_SECRET;
}

function otpDigest(email: string, otp: string) {
    const secret = resetSecret();
    if (!secret) throw new Error("Password recovery secret is not configured");
    return createHmac("sha256", secret).update(`${email}:${otp}`).digest("hex");
}

function safeEqualHex(left: string, right: string) {
    const leftBuffer = Buffer.from(left, "hex");
    const rightBuffer = Buffer.from(right, "hex");
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function setPassword(userId: string, password: string) {
    const hashedPassword = await hashPassword(password);
    await prismaClient.account.upsert({
        where: { providerId_accountId: { providerId: "credential", accountId: userId } },
        update: { password: hashedPassword, updatedAt: new Date() },
        create: {
            accountId: userId,
            providerId: "credential",
            userId,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
    // A password change should end existing sessions, including staff OTP sessions.
    await prismaClient.session.deleteMany({ where: { userId } });
}

async function sendResetLink(req: Request, res: Response) {
    const { success, data } = sendResetLinkSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Enter a valid email address." });
    }

    const baseUrl = process.env.NEXT_APP_URL || "http://localhost:3000";
    try {
        const email = data.email.trim().toLowerCase();
        const user = await prismaClient.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, appRole: true },
        });
        let emailDeliveryFailed = false;

        // Same response for unknown addresses and successful sends prevents account enumeration.
        if (user?.appRole === "CUSTOMER") {
            const secret = resetSecret();
            if (!secret) throw new Error("Password recovery secret is not configured");
            const jti = randomUUID();
            const token = jwt.sign({ email: user.email, purpose: "password-reset", jti }, secret, { expiresIn: "10m" });
            const link = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
            const identifier = `password-reset-link:${jti}`;
            await prismaClient.verification.create({
                data: { identifier, value: user.email, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            });
            const sent = await sendEmailResetLink(user.email, user.name, link);
            if (!sent) {
                await prismaClient.verification.deleteMany({ where: { identifier } });
                emailDeliveryFailed = true;
            }
        } else if (user && ["ADMIN", "CREATOR"].includes(user.appRole)) {
            const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
            const identifier = `password-reset-otp:${user.email}`;
            const value = `${otpDigest(user.email, otp)}:0`;
            const expiresAt = new Date(Date.now() + OTP_LIFETIME_MS);
            await prismaClient.verification.deleteMany({ where: { identifier } });
            await prismaClient.verification.create({ data: { identifier, value, expiresAt } });
            try {
                await sendEmailOtp(user.email, user.name, otp, "password-reset");
            } catch (error) {
                await prismaClient.verification.deleteMany({ where: { identifier } });
                console.error("Password recovery code could not be delivered", error);
                emailDeliveryFailed = true;
            }
        }

        if (emailDeliveryFailed) {
            return res.status(502).json({
                message: "We couldn't send the recovery email right now. Please try again in a few minutes.",
            });
        }

        return res.status(200).json({ message: "If an account matches that email, recovery instructions have been sent." });
    } catch (error) {
        console.error("Password recovery request could not be processed", error);
        return res.status(500).json({ message: "We couldn't process your recovery request right now. Please try again later." });
    }
}

async function resetPasswordWithLink(req: Request, res: Response) {
    const { success, data } = resetPasswordSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    const token = req.query.token;
    const secret = resetSecret();
    if (typeof token !== "string" || !secret) {
        return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }

    try {
        const decoded = jwt.verify(token, secret) as { email: string; purpose?: string; jti?: string };
        if (decoded.purpose !== "password-reset" || !decoded.jti) throw new Error("Invalid token purpose");
        const identifier = `password-reset-link:${decoded.jti}`;
        const challenge = await prismaClient.verification.findFirst({ where: { identifier } });
        if (!challenge || challenge.value !== decoded.email || challenge.expiresAt <= new Date()) {
            return res.status(400).json({ message: "This reset link is invalid or has expired." });
        }
        const user = await prismaClient.user.findUnique({ where: { email: decoded.email }, select: { id: true, appRole: true } });
        if (!user || user.appRole !== "CUSTOMER") {
            return res.status(400).json({ message: "This reset link is invalid or has expired." });
        }
        await setPassword(user.id, data.password);
        await prismaClient.verification.delete({ where: { id: challenge.id } });
        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error: any) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError" || error.message === "Invalid token purpose") {
            return res.status(400).json({
                message: "The reset link is invalid or has expired."
            });
        }
        console.error("Password reset failed", error);
        return res.status(500).json({ message: "We couldn't reset your password. Please try again." });
    }
}

async function resetPasswordWithOtp(req: Request, res: Response) {
    const parsed = resetPasswordOtpSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Check the email, six-digit code, and password." });
    const email = parsed.data.email.trim().toLowerCase();
    const identifier = `password-reset-otp:${email}`;

    try {
        const user = await prismaClient.user.findUnique({ where: { email }, select: { id: true, appRole: true } });
        const challenge = await prismaClient.verification.findFirst({ where: { identifier }, orderBy: { createdAt: "desc" } });
        if (!user || !["ADMIN", "CREATOR"].includes(user.appRole) || !challenge || challenge.expiresAt <= new Date()) {
            await prismaClient.verification.deleteMany({ where: { identifier, expiresAt: { lte: new Date() } } });
            return res.status(400).json({ message: "The code is invalid or has expired." });
        }

        const [expectedDigest, attemptsText] = challenge.value.split(":");
        const attempts = Number(attemptsText);
        if (!expectedDigest || !Number.isInteger(attempts) || attempts >= OTP_MAX_ATTEMPTS) {
            await prismaClient.verification.delete({ where: { id: challenge.id } });
            return res.status(400).json({ message: "The code is invalid or has expired." });
        }
        if (!safeEqualHex(expectedDigest, otpDigest(email, parsed.data.otp))) {
            if (attempts + 1 >= OTP_MAX_ATTEMPTS) {
                await prismaClient.verification.delete({ where: { id: challenge.id } });
            } else {
                await prismaClient.verification.update({ where: { id: challenge.id }, data: { value: `${expectedDigest}:${attempts + 1}` } });
            }
            return res.status(400).json({ message: "The code is invalid or has expired." });
        }

        await setPassword(user.id, parsed.data.password);
        await prismaClient.verification.delete({ where: { id: challenge.id } });
        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("OTP password reset failed", error);
        return res.status(500).json({ message: "We couldn't reset your password. Please try again." });
    }
}

export {
    sendResetLink,
    resetPasswordWithLink,
    resetPasswordWithOtp,
}
