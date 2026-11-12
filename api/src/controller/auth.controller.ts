import type { Request, Response } from "express";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
import prismaClient from "../config/db.js";
import jwt from "jsonwebtoken";
import { sendEmailResetLink } from "../utils/sendEmailMagicLink.js";
import { resetPasswordSchema, sendResetLinkSchema } from "../types/auth.type.js";

function resetSecret() {
    return process.env.MAGIC_LINK_SECRET || process.env.BETTER_AUTH_SECRET;
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
        if (user) {
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
        if (!user) {
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

export {
    sendResetLink,
    resetPasswordWithLink,
}
