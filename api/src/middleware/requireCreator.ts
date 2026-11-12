import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";
import prismaClient from "../config/db.js";
import jwt from "jsonwebtoken";
import { toBetterAuthHeaders } from "./requireAdmin.js";

async function resolveCreatorUser(userId: string) {
  const currentUser = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, appRole: true, image: true },
  });
  if (!currentUser) return null;
  if (currentUser.appRole === "CREATOR" || currentUser.appRole === "ADMIN") return currentUser;

  // Approved applications are an authoritative creator grant. Repair stale
  // CUSTOMER roles here so production accounts created before role sync still work.
  if (currentUser.email) {
    const approvedApplication = await prismaClient.creatorApplication.findFirst({
      where: { email: { equals: currentUser.email, mode: "insensitive" }, status: "APPROVED" },
      select: { id: true },
    });
    if (approvedApplication) {
      const promoted = await prismaClient.user.update({
        where: { id: currentUser.id },
        data: { appRole: "CREATOR" },
        select: { id: true, name: true, email: true, appRole: true, image: true },
      });
      return promoted;
    }
  }
  return null;
}

/**
 * Middleware ensuring the authenticated user has CREATOR or ADMIN access.
 */
export async function requireCreator(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 1. Better Auth session check
    const session = await auth.api.getSession({
      headers: toBetterAuthHeaders(req),
    });

    if (session?.user?.id) {
      const currentUser = await resolveCreatorUser(session.user.id);
      if (currentUser) {
        res.locals.userId = currentUser.id;
        res.locals.user = currentUser;
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
          const currentUser = await resolveCreatorUser(dbSession.userId);
          if (currentUser) {
            res.locals.userId = currentUser.id;
            res.locals.user = currentUser;
            return next();
          }
        }
      }
    }

    // 3. Fallback: Check JWT token in cookie
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const matchedToken = tokenMatch?.[1];
    const rawToken = (req as any).cookies?.token || (matchedToken ? decodeURIComponent(matchedToken) : null);
    if (rawToken && process.env.USER_SECRET) {
      try {
        const decoded = jwt.verify(rawToken, process.env.USER_SECRET) as any;
        if (decoded?.id) {
          const currentUser = await resolveCreatorUser(decoded.id);
          if (currentUser) {
            res.locals.userId = currentUser.id;
            res.locals.user = currentUser;
            return next();
          }
        }
      } catch {
        // Token verify failed
      }
    }

    return res.status(403).json({
      success: false,
      message: "Creator workspace access is required.",
    });
  } catch (error) {
    console.error("[CREATOR AUTH ERROR]", error);
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired.",
    });
  }
}
