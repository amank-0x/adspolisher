import { Router, type Request, type Response } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { z } from "zod";
import { auth } from "../auth.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";

const requestRouter: Router = Router();

const createRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  companyName: z.string().optional().nullable(),
  companyWebsite: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  projectTitle: z.string().optional().nullable(),
  serviceNeeded: z.string().optional().nullable(),
  targetPlatforms: z.array(z.string()).optional().nullable(),
  goals: z.string().optional().nullable(),
  budgetRange: z.string().optional().nullable(),
  desiredDeadline: z.string().optional().nullable(),
  message: z.string().min(1, "Project brief description is required"),
  attachments: z.any().optional(),
  userId: z.string().optional().nullable(),
});

// Helper to resolve authenticated user from Better Auth session or JWT cookie or request body
async function resolveUser(req: Request): Promise<{ id: string; email: string } | null> {
  // 1. Try Better Auth session
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    if (session?.user) {
      return { id: session.user.id, email: session.user.email };
    }
  } catch {
    // Ignore Better Auth session lookup error
  }

  // 2. Try JWT token in cookies
  const token = req.cookies?.token;
  if (token && process.env.USER_SECRET) {
    try {
      const decoded = jwt.verify(token, process.env.USER_SECRET) as JwtPayload;
      if (decoded?.id && decoded?.email) {
        return { id: decoded.id, email: decoded.email };
      }
    } catch {
      // Ignore token error
    }
  }

  return null;
}

// POST /api/v1/requests - Create a new project / quote request
requestRouter.post("/", async (req: Request, res: Response) => {
  const result = createRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const {
    name,
    email,
    companyName,
    companyWebsite,
    country,
    projectTitle,
    serviceNeeded,
    targetPlatforms,
    goals,
    budgetRange,
    desiredDeadline,
    message,
    attachments,
    userId: bodyUserId,
  } = result.data;

  try {
    const authenticatedUser = await resolveUser(req);
    const resolvedUserId = authenticatedUser?.id || bodyUserId || null;

    // Build structured attachments JSON with rich metadata
    const structuredAttachments = {
      projectTitle: projectTitle || "Custom Creative Project",
      serviceNeeded: serviceNeeded || "General Creative",
      targetPlatforms: targetPlatforms || [],
      customAttachments: attachments || [],
      submittedAt: new Date().toISOString(),
    };

    let parsedDeadline: Date | null = null;
    if (desiredDeadline) {
      const d = new Date(desiredDeadline);
      if (!isNaN(d.getTime())) {
        parsedDeadline = d;
      }
    }

    // Format full brief
    const formattedMessage = projectTitle
      ? `[Project: ${projectTitle}]\n\nService: ${serviceNeeded || 'General'}\nPlatforms: ${(targetPlatforms || []).join(', ') || 'N/A'}\n\n${message}`
      : message;

    const newRequest = await withDatabaseRetry(() =>
      prismaClient.quoteRequest.create({
        data: {
          name,
          email,
          companyName: companyName || null,
          companyWebsite: companyWebsite || null,
          country: country || null,
          message: formattedMessage,
          goals: goals || null,
          budgetRange: budgetRange || null,
          desiredDeadline: parsedDeadline,
          attachments: structuredAttachments,
          status: "NEW",
          source: "DASHBOARD_CLIENT",
          userId: resolvedUserId,
        },
      })
    );

    return res.status(201).json({
      success: true,
      message: "Project request submitted successfully",
      data: newRequest,
    });
  } catch (error: any) {
    console.error("[REQUEST CREATE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit project request",
      error: error?.message || "Internal server error",
    });
  }
});

// GET /api/v1/requests/my - Get all requests for the signed in user
requestRouter.get("/my", async (req: Request, res: Response) => {
  try {
    const user = await resolveUser(req);
    const queryUserId = (req.query.userId as string) || user?.id;
    const queryEmail = (req.query.email as string) || user?.email;

    if (!queryUserId && !queryEmail) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view your requests",
      });
    }

    const requests = await withDatabaseRetry(() =>
      prismaClient.quoteRequest.findMany({
        where: {
          OR: [
            ...(queryUserId ? [{ userId: queryUserId }] : []),
            ...(queryEmail ? [{ email: queryEmail }] : []),
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          project: {
            select: {
              id: true,
              projectCode: true,
              status: true,
            },
          },
        },
      })
    );

    return res.json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    console.error("[REQUEST GET MY ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project requests",
      error: error?.message || "Internal server error",
    });
  }
});

// GET /api/v1/requests/:id - Get a specific request by ID
requestRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }

  try {
    const request = await withDatabaseRetry(() =>
      prismaClient.quoteRequest.findUnique({
        where: { id },
        include: {
          project: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Project request not found",
      });
    }

    return res.json({
      success: true,
      data: request,
    });
  } catch (error: any) {
    console.error("[REQUEST GET ID ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project request details",
      error: error?.message || "Internal server error",
    });
  }
});

export default requestRouter;
