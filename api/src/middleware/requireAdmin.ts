import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";
import prismaClient from "../config/db.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";

export function toBetterAuthHeaders(req: Request): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) headers.set(key, value.join(", "));
    else if (value !== undefined) headers.set(key, value);
  }
  return headers;
}

/**
 * Protects staff-only API routes with the Better Auth session or verified admin token.
 * Role checks stay on the server; the dashboard must never be trusted to
 * decide whether a request is administrative.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: toBetterAuthHeaders(req),
    });
    if (session?.user?.id) {
      // Session additional fields can be stale or missing after a role change.
      // The database role is authoritative for protected admin APIs.
      const currentUser = await prismaClient.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, appRole: true },
      });
      if (currentUser?.appRole === "ADMIN") {
        res.locals.adminUserId = currentUser.id;
        res.locals.adminUser = currentUser;
        return next();
      }
    }

    // Fallback: Check Better Auth session token directly in Prisma Session table
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

          if (currentUser?.appRole === "ADMIN") {
            res.locals.adminUserId = currentUser.id;
            res.locals.adminUser = currentUser;
            return next();
          }
        }
      }
    }

    // Fallback: Check JWT token in cookie / header
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
          if (currentUser?.appRole === "ADMIN") {
            res.locals.adminUserId = currentUser.id;
            res.locals.adminUser = currentUser;
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
