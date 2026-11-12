import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";
import prismaClient from "../config/db.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "amankarn187@gmail.com,amankarn2007@gmail.com,amnkarn.temp@gmail.com,manishh9142@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

async function verifyOrPromoteAdminUser(currentUser: { id: string; name: string | null; email: string; appRole: string } | null) {
  if (!currentUser) return null;

  if (currentUser.appRole === "ADMIN") {
    return currentUser;
  }

  // Auto-promote if email is configured as an authorized administrator email
  if (currentUser.email && ADMIN_EMAILS.has(currentUser.email.trim().toLowerCase())) {
    try {
      await prismaClient.user.update({
        where: { id: currentUser.id },
        data: { appRole: "ADMIN" },
      });
      return { ...currentUser, appRole: "ADMIN" };
    } catch (err) {
      console.error("[AUTO PROMOTE ADMIN ERROR]", err);
      // Still treat as admin in-memory
      return { ...currentUser, appRole: "ADMIN" };
    }
  }

  return null;
}

export function toBetterAuthHeaders(req: Request): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) headers.set(key, value.join(", "));
    else if (value !== undefined) headers.set(key, value);
  }
  return headers;
}

/**
 * Protects staff-only API routes with the Better Auth session, secret key, or verified admin token.
 * Role checks stay on the server; the dashboard must never be trusted to
 * decide whether a request is administrative.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 0. Secret key bypass for internal / system administrative operations
    const adminKey = req.headers["x-admin-key"] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7).trim() : null);
    if (adminKey && process.env.ADMIN_SECRET_KEY && adminKey === process.env.ADMIN_SECRET_KEY) {
      res.locals.adminUserId = "system-admin";
      res.locals.adminUser = { id: "system-admin", name: "System Admin", email: "admin@adspolisher.com", appRole: "ADMIN" };
      return next();
    }

    // 1. Better Auth session check
    const session = await auth.api.getSession({
      headers: toBetterAuthHeaders(req),
    });
    if (session?.user?.id) {
      const currentUser = await prismaClient.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, appRole: true },
      });
      const adminUser = await verifyOrPromoteAdminUser(currentUser);
      if (adminUser) {
        res.locals.adminUserId = adminUser.id;
        res.locals.adminUser = adminUser;
        return next();
      }
    }

    // 2. Fallback: Check Better Auth session token directly in Prisma Session table
    const cookieHeader = req.headers.cookie || "";
    const authHeader = req.headers.authorization || "";

    const baTokenMatch = cookieHeader.match(/(?:better-auth\.session_token|__Secure-better-auth\.session_token|session_token)=([^;]+)/);
    let potentialBaToken = baTokenMatch?.[1] ? decodeURIComponent(baTokenMatch[1]) : null;

    if (!potentialBaToken && authHeader.toLowerCase().startsWith("bearer ")) {
      potentialBaToken = authHeader.slice(7).trim();
    }

    if (potentialBaToken) {
      const cleanToken = potentialBaToken.includes(".") ? potentialBaToken.split(".")[0] : potentialBaToken;
      if (cleanToken) {
        const dbSession = await prismaClient.session.findFirst({
          where: { token: cleanToken },
        });

        if (dbSession && dbSession.expiresAt > new Date()) {
          const currentUser = await prismaClient.user.findUnique({
            where: { id: dbSession.userId },
            select: { id: true, name: true, email: true, appRole: true },
          });

          const adminUser = await verifyOrPromoteAdminUser(currentUser);
          if (adminUser) {
            res.locals.adminUserId = adminUser.id;
            res.locals.adminUser = adminUser;
            return next();
          }
        }
      }
    }

    // 3. Fallback: Check JWT token in cookie / header
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const matchedToken = tokenMatch?.[1];
    const rawToken = (req as any).cookies?.token || (matchedToken ? decodeURIComponent(matchedToken) : null);
    if (rawToken && process.env.USER_SECRET) {
      try {
        const decoded = jwt.verify(rawToken, process.env.USER_SECRET) as any;
        if (decoded?.id) {
          const currentUser = await prismaClient.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, appRole: true },
          });
          const adminUser = await verifyOrPromoteAdminUser(currentUser);
          if (adminUser) {
            res.locals.adminUserId = adminUser.id;
            res.locals.adminUser = adminUser;
            return next();
          }
        }
      } catch {
        // Token verify failed
      }
    }

    return res.status(403).json({
      success: false,
      message: "Administrator access is required.",
    });
  } catch (error) {
    console.error("[ADMIN AUTH ERROR]", error);
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired.",
    });
  }
}
