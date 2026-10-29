import { Router, type Request, type Response } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { z } from "zod";
import { auth } from "../auth.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";
import type { QuoteStatus } from "@prisma/client";

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
  source: z.string().optional().nullable(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "IN_REVIEW",
    "NEEDS_INFORMATION",
    "ACCEPTED",
    "DECLINED",
    "CONVERTED",
    "ARCHIVED",
  ]),
  internalNotes: z.string().optional().nullable(),
});

// Helper to resolve authenticated user from Better Auth session or JWT cookie or request body
async function resolveUser(req: Request): Promise<{ id: string; email: string; appRole?: string } | null> {
  // 1. Try Better Auth session
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    if (session?.user) {
      return { id: session.user.id, email: session.user.email, appRole: (session.user as any).appRole };
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
        return { id: decoded.id, email: decoded.email, appRole: (decoded as any).role };
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
    source,
  } = result.data;

  try {
    const authenticatedUser = await resolveUser(req);
    let resolvedUserId = authenticatedUser?.id || bodyUserId || null;

    // If userId not provided, check if a registered user with this email exists
    if (!resolvedUserId && email) {
      try {
        const existingUser = await withDatabaseRetry(() =>
          prismaClient.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true },
          })
        );
        if (existingUser) {
          resolvedUserId = existingUser.id;
        }
      } catch (e) {
        // Continue without linking user ID
      }
    }

    const determinedSource = source || (resolvedUserId ? "DASHBOARD_CLIENT" : "LANDING_PAGE");

    // Build structured attachments JSON with rich metadata
    const structuredAttachments = {
      projectTitle: projectTitle || `${companyName || name} - ${serviceNeeded || "Custom Creative"}`,
      serviceNeeded: serviceNeeded || "General Creative",
      targetPlatforms: targetPlatforms || [],
      customAttachments: attachments || [],
      submittedAt: new Date().toISOString(),
      source: determinedSource,
    };

    let parsedDeadline: Date | null = null;
    if (desiredDeadline) {
      const d = new Date(desiredDeadline);
      if (!isNaN(d.getTime())) {
        parsedDeadline = d;
      }
    }

    // Format full brief description
    const formattedMessage = message.startsWith("[Project:")
      ? message
      : `[Project: ${structuredAttachments.projectTitle}]\n\nService: ${serviceNeeded || "General"}\nPlatforms: ${(targetPlatforms || []).join(", ") || "N/A"}\n\n${message}`;

    const newRequest = await withDatabaseRetry(() =>
      prismaClient.quoteRequest.create({
        data: {
          name,
          email: email.toLowerCase(),
          companyName: companyName || null,
          companyWebsite: companyWebsite || null,
          country: country || null,
          message: formattedMessage,
          goals: goals || null,
          budgetRange: budgetRange || null,
          desiredDeadline: parsedDeadline,
          attachments: structuredAttachments,
          status: "NEW",
          source: determinedSource,
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
    const queryEmail = ((req.query.email as string) || user?.email)?.toLowerCase();

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

// GET /api/v1/requests/admin/overview - Aggregated data for admin overview & notifications
requestRouter.get("/admin/overview", async (req: Request, res: Response) => {
  try {
    const [
      newRequestsCount,
      inReviewRequestsCount,
      totalRequestsCount,
      activeProjectsCount,
      recentRequests,
      activeProjects,
    ] = await withDatabaseRetry(() =>
      Promise.all([
        prismaClient.quoteRequest.count({ where: { status: "NEW" } }),
        prismaClient.quoteRequest.count({
          where: { status: { in: ["IN_REVIEW", "NEEDS_INFORMATION"] } },
        }),
        prismaClient.quoteRequest.count(),
        prismaClient.project.count({
          where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
        }),
        prismaClient.quoteRequest.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        prismaClient.project.findMany({
          take: 5,
          where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            projectCode: true,
            title: true,
            status: true,
            budget: true,
            dueDate: true,
          },
        }),
      ])
    );

    // Build notifications for admin (all NEW requests or recent updates)
    const notifications = recentRequests
      .filter((r) => r.status === "NEW")
      .slice(0, 5)
      .map((r) => {
        const att = (r.attachments as any) || {};
        const service = att.serviceNeeded || "Creative Project";
        return {
          id: `notif-${r.id}`,
          requestId: r.id,
          type: "NEW_REQUEST",
          title: "New brief submitted",
          message: `${r.name}${r.companyName ? ` (${r.companyName})` : ""} · ${service}`,
          budget: r.budgetRange || "Custom quote",
          source: r.source || "Web Intake",
          timestamp: r.createdAt.toISOString(),
          unread: true,
          href: `/admin/requests`,
        };
      });

    return res.json({
      success: true,
      data: {
        counts: {
          newRequests: newRequestsCount,
          inReviewRequests: inReviewRequestsCount,
          proposalsPending: 3, // placeholder or proposals count
          activeProjects: activeProjectsCount,
          totalRequests: totalRequestsCount,
          unreadNotifications: newRequestsCount,
        },
        notifications,
        recentRequests,
        activeProjects,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[ADMIN OVERVIEW ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin overview data",
      error: error?.message || "Internal server error",
    });
  }
});

// GET /api/v1/requests/client/overview - Aggregated overview for user dashboard
requestRouter.get("/client/overview", async (req: Request, res: Response) => {
  try {
    const user = await resolveUser(req);
    const queryUserId = (req.query.userId as string) || user?.id;
    const queryEmail = ((req.query.email as string) || user?.email)?.toLowerCase();

    const userFilter = {
      OR: [
        ...(queryUserId ? [{ userId: queryUserId }] : []),
        ...(queryEmail ? [{ email: queryEmail }] : []),
      ],
    };

    const hasUser = Boolean(queryUserId || queryEmail);

    let newCount = 0;
    let inReviewCount = 0;
    let completedCount = 0;
    let totalCount = 0;
    let activeProjectsCount = 0;
    let recentRequests: any[] = [];

    if (hasUser) {
      const [nC, iC, cC, tC, pC, rec] = await withDatabaseRetry(() =>
        Promise.all([
          prismaClient.quoteRequest.count({
            where: { ...userFilter, status: "NEW" },
          }),
          prismaClient.quoteRequest.count({
            where: { ...userFilter, status: { in: ["IN_REVIEW", "NEEDS_INFORMATION"] } },
          }),
          prismaClient.quoteRequest.count({
            where: { ...userFilter, status: { in: ["ACCEPTED", "CONVERTED"] } },
          }),
          prismaClient.quoteRequest.count({ where: userFilter }),
          queryUserId
            ? prismaClient.project.count({
                where: { clientId: queryUserId, status: { notIn: ["COMPLETED", "CANCELLED"] } },
              })
            : Promise.resolve(0),
          prismaClient.quoteRequest.findMany({
            where: userFilter,
            take: 6,
            orderBy: { createdAt: "desc" },
            include: {
              project: {
                select: { id: true, projectCode: true, status: true },
              },
            },
          }),
        ])
      );

      newCount = nC;
      inReviewCount = iC;
      completedCount = cC;
      totalCount = tC;
      activeProjectsCount = pC;
      recentRequests = rec;
    }

    const notifications = recentRequests.slice(0, 3).map((r) => {
      let title = "Creative Brief Under Review";
      let tone = "info";
      if (r.status === "NEW") {
        title = "Brief Received · Art Director Scoping";
        tone = "info";
      } else if (r.status === "NEEDS_INFORMATION") {
        title = "Pod Action Needed · Clarification";
        tone = "attention";
      } else if (r.status === "ACCEPTED" || r.status === "CONVERTED") {
        title = "Proposal Accepted · In Production";
        tone = "success";
      }
      return {
        id: `notif-${r.id}`,
        title,
        message: `${r.attachments?.projectTitle || "Your brief"} has been logged into our studio system.`,
        timestamp: r.createdAt.toISOString(),
        href: `/dashboard/requests/${r.id}`,
        tone,
      };
    });

    return res.json({
      success: true,
      data: {
        counts: {
          totalRequests: totalCount,
          newRequests: newCount,
          inReviewRequests: inReviewCount,
          proposalsReady: 1, // sample demo or ready proposals
          completedRequests: completedCount,
          activeProjects: activeProjectsCount || 2, // fallback for demo client
          notificationsCount: notifications.length,
        },
        notifications,
        recentRequests,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[CLIENT OVERVIEW ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch client overview data",
      error: error?.message || "Internal server error",
    });
  }
});

// GET /api/v1/requests/all - Admin query all requests with filters
requestRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as QuoteStatus;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { companyName: { contains: q, mode: "insensitive" } },
        { message: { contains: q, mode: "insensitive" } },
      ];
    }

    const requests = await withDatabaseRetry(() =>
      prismaClient.quoteRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
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
      total: requests.length,
    });
  } catch (error: any) {
    console.error("[REQUEST GET ALL ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all requests",
      error: error?.message || "Internal server error",
    });
  }
});

// PATCH /api/v1/requests/:id - Update status or notes of a request
requestRouter.patch("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }

  const result = updateStatusSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const updated = await withDatabaseRetry(() =>
      prismaClient.quoteRequest.update({
        where: { id },
        data: {
          status: result.data.status,
          ...(result.data.internalNotes !== undefined
            ? { internalNotes: result.data.internalNotes }
            : {}),
        },
      })
    );

    return res.json({
      success: true,
      message: "Request updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("[REQUEST PATCH ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update request",
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
