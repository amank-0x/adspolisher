import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";

export function toBetterAuthHeaders(req: Request): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) headers.set(key, value.join(", "));
    else if (value !== undefined) headers.set(key, value);
  }
  return headers;
}

/**
 * Protects staff-only API routes with the Better Auth session.
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

    if (!session?.user || appRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Administrator access is required.",
      });
    }

    res.locals.adminUserId = session.user.id;
    res.locals.adminUser = session.user;
    return next();
  } catch (error) {
    console.error("[ADMIN AUTH ERROR]", error);
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired.",
    });
  }
}
