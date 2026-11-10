import { Router, type Request, type Response } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { z } from "zod";
import { requireAdmin } from "../middleware/requireAdmin.js";
import type { ProjectStatus, DeliverableStatus } from "@prisma/client";

const projectRouter: Router = Router();

// Validation schema for updating a project
const updateProjectSchema = z.object({
  status: z
    .enum([
      "INTAKE",
      "PLANNED",
      "IN_PROGRESS",
      "IN_REVIEW",
      "WAITING_FOR_CLIENT",
      "COMPLETED",
      "ON_HOLD",
      "CANCELLED",
    ])
    .optional(),
  title: z.string().trim().min(1).optional(),
  brief: z.string().trim().min(1).optional(),
  budget: z.union([z.number(), z.string()]).nullable().optional(),
  currency: z.string().trim().max(3).optional(),
  dueDate: z.string().nullable().optional(),
  assignedToId: z.string().nullable().optional(),
});

// Validation schema for adding a deliverable
const createDeliverableSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional().nullable(),
  fileUrl: z.string().trim().min(1, "File / Asset URL is required"),
  previewUrl: z.string().trim().optional().nullable(),
  version: z.number().int().min(1).optional().default(1),
  status: z
    .enum(["DRAFT", "SHARED", "CHANGES_REQUESTED", "APPROVED"])
    .optional()
    .default("SHARED"),
});

// Validation schema for updating a deliverable
const updateDeliverableSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().nullable().optional(),
  fileUrl: z.string().trim().min(1).optional(),
  previewUrl: z.string().trim().nullable().optional(),
  version: z.number().int().min(1).optional(),
  status: z.enum(["DRAFT", "SHARED", "CHANGES_REQUESTED", "APPROVED"]).optional(),
});

/**
 * GET /api/v1/projects/creators - List assignable team members (Creators & Admins)
 */
projectRouter.get("/creators", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const creators = await withDatabaseRetry(() =>
      prismaClient.user.findMany({
        where: {
          appRole: { in: ["CREATOR", "ADMIN"] },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          appRole: true,
        },
        orderBy: { name: "asc" },
      })
    );
    return res.json({ success: true, data: creators });
  } catch (error: any) {
    console.error("[GET CREATORS ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creators list.",
      error: error?.message,
    });
  }
});

/**
 * GET /api/v1/projects - List projects with filters, search, and count
 */
projectRouter.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as ProjectStatus;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { projectCode: { contains: q, mode: "insensitive" } },
        { brief: { contains: q, mode: "insensitive" } },
        { client: { name: { contains: q, mode: "insensitive" } } },
        { client: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const projects = await withDatabaseRetry(() =>
      prismaClient.project.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              appRole: true,
            },
          },
          _count: {
            select: {
              deliverables: true,
              messages: true,
              teamMembers: true,
            },
          },
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  appRole: true,
                },
              },
            },
            orderBy: { joinedAt: "asc" },
          },
        },
      })
    );

    return res.json({ success: true, data: projects });
  } catch (error: any) {
    console.error("[GET ALL PROJECTS ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load projects.",
      error: error?.message,
    });
  }
});

/**
 * GET /api/v1/projects/:id - Get detailed project information
 */
projectRouter.get("/:id", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({ success: false, message: "Project ID is required." });
  }

  try {
    const project = await withDatabaseRetry(() =>
      prismaClient.project.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              appRole: true,
              createdAt: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              appRole: true,
            },
          },
          deliverables: {
            orderBy: [{ version: "desc" }, { createdAt: "desc" }],
            include: {
              uploadedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          quoteRequest: {
            select: {
              id: true,
              status: true,
              companyName: true,
              companyWebsite: true,
              message: true,
              attachments: true,
              createdAt: true,
            },
          },
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  appRole: true,
                },
              },
            },
            orderBy: { joinedAt: "asc" },
          },
          _count: {
            select: {
              messages: true,
              deliverables: true,
              teamMembers: true,
            },
          },
        },
      })
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    return res.json({ success: true, data: project });
  } catch (error: any) {
    console.error("[GET PROJECT DETAIL ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve project details.",
      error: error?.message,
    });
  }
});

/**
 * PATCH /api/v1/projects/:id - Update project status, dates, budget, assigned creator, etc.
 */
projectRouter.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({ success: false, message: "Project ID is required." });
  }

  const parseResult = updateProjectSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  try {
    const existing = await prismaClient.project.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const { status, title, brief, budget, currency, dueDate, assignedToId } = parseResult.data;
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (brief !== undefined) updateData.brief = brief;
    if (currency !== undefined) updateData.currency = currency.toUpperCase();
    if (budget !== undefined) {
      updateData.budget = budget === null || budget === "" ? null : Number(budget);
    }
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }
    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId || null;
    }

    if (status !== undefined) {
      updateData.status = status;
      // Lifecycle auto-timestamps
      if (status === "COMPLETED") {
        if (!existing.completedAt) {
          updateData.completedAt = new Date();
        }
      } else if (existing.completedAt) {
        // If moved out of completed, remove completedAt
        updateData.completedAt = null;
      }

      if (status === "IN_PROGRESS" && !existing.startDate) {
        updateData.startDate = new Date();
      }
    }

    const updated = await withDatabaseRetry(() =>
      prismaClient.project.update({
        where: { id },
        data: updateData,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              appRole: true,
            },
          },
          deliverables: {
            orderBy: [{ version: "desc" }, { createdAt: "desc" }],
          },
          quoteRequest: {
            select: {
              id: true,
              status: true,
              companyName: true,
            },
          },
        },
      })
    );

    return res.json({
      success: true,
      message: `Project status updated to ${updated.status}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("[PATCH PROJECT ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
      error: error?.message,
    });
  }
});

/**
 * POST /api/v1/projects/:id/deliverables - Add a deliverable / asset to the project
 */
projectRouter.post("/:id/deliverables", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({ success: false, message: "Project ID is required." });
  }

  const parseResult = createDeliverableSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  try {
    const project = await prismaClient.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const adminUserId = res.locals.adminUserId as string | undefined;
    const { title, description, fileUrl, previewUrl, version, status } = parseResult.data;

    const deliverable = await withDatabaseRetry(() =>
      prismaClient.deliverable.create({
        data: {
          projectId: id,
          title,
          description: description || null,
          fileUrl,
          previewUrl: previewUrl || null,
          version: version || 1,
          status: (status as DeliverableStatus) || "SHARED",
          sharedAt: status === "SHARED" || status === "APPROVED" ? new Date() : null,
          approvedAt: status === "APPROVED" ? new Date() : null,
          uploadedById: adminUserId || null,
        },
      })
    );

    return res.status(201).json({
      success: true,
      message: "Deliverable added successfully.",
      data: deliverable,
    });
  } catch (error: any) {
    console.error("[ADD DELIVERABLE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create deliverable.",
      error: error?.message,
    });
  }
});

/**
 * PATCH /api/v1/projects/:id/deliverables/:deliverableId - Update deliverable
 */
projectRouter.patch(
  "/:id/deliverables/:deliverableId",
  requireAdmin,
  async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const rawDelivId = req.params.deliverableId;
    const deliverableId = Array.isArray(rawDelivId) ? rawDelivId[0] : rawDelivId;

    if (!id || !deliverableId) {
      return res.status(400).json({ success: false, message: "Project and Deliverable IDs are required." });
    }

    const parseResult = updateDeliverableSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    try {
      const existing = await prismaClient.deliverable.findFirst({
        where: { id: deliverableId, projectId: id },
      });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Deliverable not found." });
      }

      const updateData: any = {};
      if (parseResult.data.title !== undefined) updateData.title = parseResult.data.title;
      if (parseResult.data.description !== undefined) updateData.description = parseResult.data.description;
      if (parseResult.data.fileUrl !== undefined) updateData.fileUrl = parseResult.data.fileUrl;
      if (parseResult.data.previewUrl !== undefined) updateData.previewUrl = parseResult.data.previewUrl;
      if (parseResult.data.version !== undefined) updateData.version = parseResult.data.version;
      if (parseResult.data.status !== undefined) {
        updateData.status = parseResult.data.status;
        if (parseResult.data.status === "APPROVED" && !existing.approvedAt) {
          updateData.approvedAt = new Date();
        }
        if (
          (parseResult.data.status === "SHARED" || parseResult.data.status === "APPROVED") &&
          !existing.sharedAt
        ) {
          updateData.sharedAt = new Date();
        }
      }

      const updated = await withDatabaseRetry(() =>
        prismaClient.deliverable.update({
          where: { id: deliverableId },
          data: updateData,
        })
      );

      return res.json({
        success: true,
        message: "Deliverable updated successfully.",
        data: updated,
      });
    } catch (error: any) {
      console.error("[PATCH DELIVERABLE ERROR]", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update deliverable.",
        error: error?.message,
      });
    }
  }
);

/**
 * DELETE /api/v1/projects/:id/deliverables/:deliverableId - Remove a deliverable
 */
projectRouter.delete(
  "/:id/deliverables/:deliverableId",
  requireAdmin,
  async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const rawDelivId = req.params.deliverableId;
    const deliverableId = Array.isArray(rawDelivId) ? rawDelivId[0] : rawDelivId;

    if (!id || !deliverableId) {
      return res.status(400).json({ success: false, message: "Project and Deliverable IDs are required." });
    }

    try {
      const existing = await prismaClient.deliverable.findFirst({
        where: { id: deliverableId, projectId: id },
      });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Deliverable not found." });
      }

      await withDatabaseRetry(() =>
        prismaClient.deliverable.delete({
          where: { id: deliverableId },
        })
      );

      return res.json({ success: true, message: "Deliverable removed." });
    } catch (error: any) {
      console.error("[DELETE DELIVERABLE ERROR]", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete deliverable.",
        error: error?.message,
      });
    }
  }
);

// ----------------------------------------------------
// PROJECT TEAM MANAGEMENT (ROLE: CREATOR)
// ----------------------------------------------------

const addTeamMemberSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  roleTitle: z.string().trim().optional().default("Creator"),
});

const updateTeamMemberSchema = z.object({
  roleTitle: z.string().trim().min(1, "Role title is required"),
});

const inviteCreatorSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  name: z.string().trim().optional().default("Creator"),
});

/**
 * GET /api/v1/projects/roster/creators - Get all agency creators with their assigned project workload
 */
projectRouter.get("/roster/creators", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const creators = await withDatabaseRetry(() =>
      prismaClient.user.findMany({
        where: { appRole: "CREATOR" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          appRole: true,
          createdAt: true,
          projectMemberships: {
            include: {
              project: {
                select: {
                  id: true,
                  projectCode: true,
                  title: true,
                  status: true,
                  dueDate: true,
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      })
    );

    return res.json({ success: true, data: creators });
  } catch (error: any) {
    console.error("[GET CREATORS ROSTER ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load creator roster.",
      error: error?.message,
    });
  }
});

/**
 * POST /api/v1/projects/roster/creators - Add/promote a creator to the agency roster
 */
projectRouter.post("/roster/creators", requireAdmin, async (req: Request, res: Response) => {
  const parseResult = inviteCreatorSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const { email, name } = parseResult.data;

  try {
    const user = await withDatabaseRetry(() =>
      prismaClient.user.upsert({
        where: { email },
        update: {
          appRole: "CREATOR",
          ...(name ? { name } : {}),
        },
        create: {
          email,
          name: name || email.split("@")[0] || "Creator",
          appRole: "CREATOR",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          appRole: true,
        },
      })
    );

    return res.status(201).json({
      success: true,
      message: `${user.name || user.email} is now registered with the CREATOR role.`,
      data: user,
    });
  } catch (error: any) {
    console.error("[ADD CREATOR TO ROSTER ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add creator to roster.",
      error: error?.message,
    });
  }
});

/**
 * GET /api/v1/projects/:id/team - Get all team members for a specific project
 */
projectRouter.get("/:id/team", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({ success: false, message: "Project ID is required." });
  }

  try {
    const project = await withDatabaseRetry(() =>
      prismaClient.project.findUnique({
        where: { id },
        select: {
          id: true,
          projectCode: true,
          title: true,
          status: true,
          assignedToId: true,
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  appRole: true,
                },
              },
            },
            orderBy: { joinedAt: "asc" },
          },
        },
      })
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    return res.json({ success: true, data: project });
  } catch (error: any) {
    console.error("[GET PROJECT TEAM ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load project team.",
      error: error?.message,
    });
  }
});

/**
 * POST /api/v1/projects/:id/team - Add a creator member to the project team
 */
projectRouter.post("/:id/team", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({ success: false, message: "Project ID is required." });
  }

  const parseResult = addTeamMemberSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const { userId, roleTitle } = parseResult.data;

  try {
    // 1. Verify project exists
    const project = await prismaClient.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    // 2. Verify user exists and check that appRole === 'CREATOR'
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.appRole !== "CREATOR") {
      return res.status(400).json({
        success: false,
        message: `Only users with the role of "CREATOR" can be added to the project creative pod. (User ${user.name || user.email} has role "${user.appRole}")`,
      });
    }

    // 3. Upsert team member
    const teamMember = await withDatabaseRetry(() =>
      prismaClient.projectTeamMember.upsert({
        where: {
          projectId_userId: {
            projectId: id,
            userId,
          },
        },
        update: {
          roleTitle: roleTitle || "Creator",
        },
        create: {
          projectId: id,
          userId,
          roleTitle: roleTitle || "Creator",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              appRole: true,
            },
          },
        },
      })
    );

    // 4. If project currently has no assignedTo, set this creator as primary assignee
    if (!project.assignedToId) {
      await prismaClient.project.update({
        where: { id },
        data: { assignedToId: userId },
      });
    }

    return res.status(201).json({
      success: true,
      message: `${user.name || user.email} was added to the project creative pod as ${roleTitle || "Creator"}.`,
      data: teamMember,
    });
  } catch (error: any) {
    console.error("[ADD TEAM MEMBER ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add member to team.",
      error: error?.message,
    });
  }
});

/**
 * PATCH /api/v1/projects/:id/team/:userId - Update team member role/discipline title
 */
projectRouter.patch("/:id/team/:userId", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const rawUserId = req.params.userId;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  if (!id || !userId) {
    return res.status(400).json({ success: false, message: "Project and User IDs are required." });
  }

  const parseResult = updateTeamMemberSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  try {
    const existing = await prismaClient.projectTeamMember.findUnique({
      where: {
        projectId_userId: { projectId: id, userId },
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Team member not found on this project." });
    }

    const updated = await withDatabaseRetry(() =>
      prismaClient.projectTeamMember.update({
        where: { id: existing.id },
        data: { roleTitle: parseResult.data.roleTitle },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              appRole: true,
            },
          },
        },
      })
    );

    return res.json({
      success: true,
      message: "Team member role updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[PATCH TEAM MEMBER ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update team member role.",
      error: error?.message,
    });
  }
});

/**
 * DELETE /api/v1/projects/:id/team/:userId - Remove a creator member from the project team
 */
projectRouter.delete("/:id/team/:userId", requireAdmin, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const rawUserId = req.params.userId;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  if (!id || !userId) {
    return res.status(400).json({ success: false, message: "Project and User IDs are required." });
  }

  try {
    const existing = await prismaClient.projectTeamMember.findUnique({
      where: {
        projectId_userId: { projectId: id, userId },
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Team member not found on this project." });
    }

    await withDatabaseRetry(() =>
      prismaClient.projectTeamMember.delete({
        where: { id: existing.id },
      })
    );

    // If this creator was also project.assignedToId, update to another member or null
    const project = await prismaClient.project.findUnique({
      where: { id },
      include: { teamMembers: { take: 1 } },
    });

    if (project && project.assignedToId === userId) {
      const nextAssigneeId = project.teamMembers[0]?.userId || null;
      await prismaClient.project.update({
        where: { id },
        data: { assignedToId: nextAssigneeId },
      });
    }

    return res.json({
      success: true,
      message: `${existing.user.name || existing.user.email} was removed from the project team.`,
    });
  } catch (error: any) {
    console.error("[DELETE TEAM MEMBER ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove member from team.",
      error: error?.message,
    });
  }
});

export default projectRouter;
