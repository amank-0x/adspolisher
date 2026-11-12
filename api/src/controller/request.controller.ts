import { type Request, type Response  } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { z } from "zod";
import { auth } from "../auth.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";
import type { QuoteStatus } from "@prisma/client";
import { toBetterAuthHeaders } from "../middleware/requireAdmin.js";
import { sendRequestAcceptedEmail } from "../utils/sendRequestAcceptedEmail.js";


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
      headers: toBetterAuthHeaders(req),
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

// GET /api/v1/requests/my - Get all requests for the signed in user

// GET /api/v1/requests/admin/overview - Aggregated data for admin overview & notifications

// GET /api/v1/requests/client/overview - Aggregated overview for user dashboard

// GET /api/v1/requests/all - Admin query all requests with filters

// PATCH /api/v1/requests/:id - Update status or notes of a request

// GET /api/v1/requests/:id - Get a specific request by ID

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prismaClient.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, email: true, image: true } },
        assignedTo: { select: { id: true, name: true, email: true, image: true, appRole: true } },
        _count: { select: { deliverables: true, messages: true } },
      },
    });
    return res.json({ success: true, data: projects });
  } catch (error) {
    console.error("[ADMIN PROJECTS GET ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load projects." });
  }
};

export const postRoot = async (req: Request, res: Response) => {
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
};

export const getMy = async (req: Request, res: Response) => {
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
};

export const getAdminoverview = async (req: Request, res: Response) => {
  try {
    const chartStart = new Date();
    chartStart.setUTCHours(0, 0, 0, 0);
    chartStart.setUTCDate(chartStart.getUTCDate() - 29);
    const [
      newRequestsCount,
      inReviewRequestsCount,
      totalRequestsCount,
      proposalsPendingCount,
      activeProjectsCount,
      pendingCreatorApplicationsCount,
      recentRequests,
      activeProjects,
      requestChartEvents,
      projectChartEvents,
    ] = await withDatabaseRetry(() =>
      Promise.all([
        prismaClient.quoteRequest.count({ where: { status: "NEW" } }),
        prismaClient.quoteRequest.count({
          where: { status: { in: ["IN_REVIEW", "NEEDS_INFORMATION"] } },
        }),
        prismaClient.quoteRequest.count(),
        prismaClient.proposal.count({ where: { status: { in: ["SENT", "VIEWED"] } } }),
        prismaClient.project.count({
          where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
        }),
        prismaClient.creatorApplication.count({ where: { status: "PENDING" } }),
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
        prismaClient.quoteRequest.findMany({
          where: { createdAt: { gte: chartStart } },
          select: { createdAt: true },
        }),
        prismaClient.project.findMany({
          where: { updatedAt: { gte: chartStart } },
          select: { updatedAt: true },
        }),
      ])
    );

    const chartDays = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(chartStart);
      date.setUTCDate(chartStart.getUTCDate() + index);
      return { date: date.toISOString().slice(0, 10), requests: 0, activity: 0 };
    });
    const chartByDate = new Map(chartDays.map((day) => [day.date, day]));
    for (const event of requestChartEvents) {
      const day = chartByDate.get(event.createdAt.toISOString().slice(0, 10));
      if (day) day.requests += 1;
    }
    for (const event of projectChartEvents) {
      const day = chartByDate.get(event.updatedAt.toISOString().slice(0, 10));
      if (day) day.activity += 1;
    }

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
          proposalsPending: proposalsPendingCount,
          activeProjects: activeProjectsCount,
          pendingCreatorApplications: pendingCreatorApplicationsCount,
          totalRequests: totalRequestsCount,
          unreadNotifications: newRequestsCount,
        },
        notifications,
        recentRequests,
        activeProjects,
        charts: {
          projectRequests: chartDays.map(({ date, requests }) => ({ date, count: requests })),
          projectActivity: chartDays.map(({ date, activity }) => ({ date, count: activity })),
        },
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
};

export const getClientoverview = async (req: Request, res: Response) => {
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
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = { status: { notIn: ["ACCEPTED", "CONVERTED", "DECLINED"] } };
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
};

export const patchById = async (req: Request, res: Response) => {
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
    const existing = await prismaClient.quoteRequest.findUnique({ where: { id }, include: { project: true } });
    if (!existing) return res.status(404).json({ success: false, message: "Request not found" });
    const updated = await prismaClient.$transaction(async (tx) => {
      const request = await tx.quoteRequest.update({ where: { id }, data: {
        status: result.data.status,
        ...(result.data.internalNotes !== undefined ? { internalNotes: result.data.internalNotes } : {}),
      }});
      if (result.data.status === "ACCEPTED" && !existing.project) {
        const client = existing.userId
          ? await tx.user.findUnique({ where: { id: existing.userId } })
          : await tx.user.upsert({ where: { email: existing.email }, update: {}, create: { email: existing.email, name: existing.name } });
        if (!client) throw new Error("Could not find or create project client");
        const details = existing.attachments && typeof existing.attachments === "object" ? existing.attachments as Record<string, unknown> : {};
        const title = typeof details.projectTitle === "string" ? details.projectTitle : `${existing.companyName || existing.name} - Creative Project`;
        await tx.project.create({ data: {
          projectCode: `AP-${Date.now().toString(36).toUpperCase()}`,
          title,
          brief: existing.message,
          status: "INTAKE",
          clientId: client.id,
          quoteRequestId: id,
        }});
      }
      if (result.data.status === "DECLINED") {
        await tx.quoteRequest.delete({ where: { id } });
      }
      return request;
    });
    let emailSent = false;
    if ((result.data.status === "ACCEPTED" && existing.status !== "ACCEPTED") || result.data.status === "DECLINED") {
      try { await sendRequestAcceptedEmail(existing.email, existing.name, process.env.NEXT_APP_URL || "https://www.adspolisher.com"); emailSent = true; }
      catch (emailError) { console.error("[REQUEST ACCEPTANCE EMAIL ERROR]", emailError); }
    }

    return res.json({
      success: true,
      message: result.data.status === "ACCEPTED" ? (emailSent ? "Request accepted, project created, and client notified." : "Request accepted and project created, but confirmation email could not be sent.") : result.data.status === "DECLINED" ? "Request rejected and removed." : "Request updated successfully",
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
};

export const getById = async (req: Request, res: Response) => {
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
        proposals: {
          where: { status: { in: ["SENT", "VIEWED", "ACCEPTED"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            title: true,
            summary: true,
            deliverables: true,
            price: true,
            currency: true,
            timeline: true,
            revisionLimit: true,
            paymentTerms: true,
            expiresAt: true,
            status: true,
            sentAt: true,
          },
        },
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
};
