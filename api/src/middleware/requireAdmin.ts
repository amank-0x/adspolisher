import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";
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
    const appRole = String(session?.user?.appRole ?? "").toUpperCase();

    if (session?.user && appRole === "ADMIN") {
      res.locals.adminUserId = session.user.id;
      res.locals.adminUser = session.user;
      return next();
    }

    // Fallback: Check token in cookie / header
    const cookieHeader = req.headers.cookie || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const matchedToken = tokenMatch?.[1];
    const rawToken = (req as any).cookies?.token || (matchedToken ? decodeURIComponent(matchedToken) : null);
    if (rawToken && process.env.USER_SECRET) {
      try {
        const decoded = jwt.verify(rawToken, process.env.USER_SECRET) as any;
        const decodedRole = String(decoded?.role || decoded?.appRole || "").toUpperCase();
        if (decoded?.id && decodedRole === "ADMIN") {
          res.locals.adminUserId = decoded.id;
          res.locals.adminUser = decoded;
          return next();
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
