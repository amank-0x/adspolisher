import { type Request, type Response  } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";

/**
 * GET /api/v1/admin/portfolio/creators - List all creators with summary portfolio stats
 */

/**
 * GET /api/v1/admin/portfolio/creators/:id - Detailed portfolio, account details & full history
 */

export const getCreators = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const filter = typeof req.query.filter === "string" ? req.query.filter : "ALL";

    const where: any = { appRole: "CREATOR" };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const creators = await withDatabaseRetry(() =>
      prismaClient.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          appRole: true,
          emailVerified: true,
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
          assignedProjects: {
            select: {
              id: true,
              projectCode: true,
              title: true,
              status: true,
              dueDate: true,
            },
          },
          uploadedDeliverables: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: { name: "asc" },
      })
    );

    const formatted = creators.map((c) => {
      // Collect unique active projects
      const activeProjectMap = new Map<string, { id: string; projectCode: string; title: string; status: string; dueDate: Date | null; roleTitle?: string | null }>();

      for (const m of c.projectMemberships) {
        if (m.project && m.project.status !== "COMPLETED" && m.project.status !== "CANCELLED") {
          activeProjectMap.set(m.project.id, {
            ...m.project,
            roleTitle: m.roleTitle,
          });
        }
      }

      for (const p of c.assignedProjects) {
        if (p.status !== "COMPLETED" && p.status !== "CANCELLED") {
          if (!activeProjectMap.has(p.id)) {
            activeProjectMap.set(p.id, {
              ...p,
              roleTitle: "Lead Creator",
            });
          }
        }
      }

      const activeProjects = Array.from(activeProjectMap.values());
      const totalProjectsCount = new Set([
        ...c.projectMemberships.map((m) => m.projectId),
        ...c.assignedProjects.map((p) => p.id),
      ]).size;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        image: c.image,
        appRole: c.appRole,
        emailVerified: c.emailVerified,
        createdAt: c.createdAt,
        totalProjects: totalProjectsCount,
        activeProjectsCount: activeProjects.length,
        deliverablesCount: c.uploadedDeliverables.length,
        currentProjects: activeProjects.slice(0, 3),
      };
    });

    let result = formatted;
    if (filter === "ACTIVE") {
      result = formatted.filter((c) => c.activeProjectsCount > 0);
    } else if (filter === "IDLE") {
      result = formatted.filter((c) => c.activeProjectsCount === 0);
    }

    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[GET PORTFOLIO CREATORS ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load creator portfolios.",
      error: error?.message,
    });
  }
};

export const getCreatorsById = async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({ success: false, message: "Creator ID is required." });
  }

  try {
    const creator = await withDatabaseRetry(() =>
      prismaClient.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          appRole: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          projectMemberships: {
            include: {
              project: {
                include: {
                  client: {
                    select: { id: true, name: true, email: true },
                  },
                  _count: {
                    select: { deliverables: true },
                  },
                },
              },
            },
            orderBy: { joinedAt: "desc" },
          },
          assignedProjects: {
            include: {
              client: {
                select: { id: true, name: true, email: true },
              },
              _count: {
                select: { deliverables: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          uploadedDeliverables: {
            include: {
              project: {
                select: { id: true, projectCode: true, title: true, status: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      })
    );

    if (!creator) {
      return res.status(404).json({ success: false, message: "Creator not found." });
    }

    // Consolidate project records
    const allProjectIds = new Set<string>();
    const activeProjects: any[] = [];
    const projectHistory: any[] = [];

    // Process memberships
    for (const m of creator.projectMemberships) {
      const p = m.project;
      if (!p || allProjectIds.has(p.id)) continue;
      allProjectIds.add(p.id);

      const item = {
        id: p.id,
        projectCode: p.projectCode,
        title: p.title,
        brief: p.brief,
        status: p.status,
        budget: p.budget,
        currency: p.currency,
        startDate: p.startDate,
        dueDate: p.dueDate,
        completedAt: p.completedAt,
        createdAt: p.createdAt,
        client: p.client,
        roleTitle: m.roleTitle || "Creator",
        deliverablesCount: p._count.deliverables,
      };

      if (p.status === "COMPLETED" || p.status === "CANCELLED" || p.status === "ON_HOLD") {
        projectHistory.push(item);
      } else {
        activeProjects.push(item);
      }
    }

    // Process assignedProjects (if not already added via membership)
    for (const p of creator.assignedProjects) {
      if (allProjectIds.has(p.id)) continue;
      allProjectIds.add(p.id);

      const item = {
        id: p.id,
        projectCode: p.projectCode,
        title: p.title,
        brief: p.brief,
        status: p.status,
        budget: p.budget,
        currency: p.currency,
        startDate: p.startDate,
        dueDate: p.dueDate,
        completedAt: p.completedAt,
        createdAt: p.createdAt,
        client: p.client,
        roleTitle: "Lead Creator",
        deliverablesCount: p._count.deliverables,
      };

      if (p.status === "COMPLETED" || p.status === "CANCELLED" || p.status === "ON_HOLD") {
        projectHistory.push(item);
      } else {
        activeProjects.push(item);
      }
    }

    // Fetch any additional deliverables on projects this creator was a member of
    const projectIdsArray = Array.from(allProjectIds);
    let projectDeliverables: any[] = [];
    if (projectIdsArray.length > 0) {
      projectDeliverables = await withDatabaseRetry(() =>
        prismaClient.deliverable.findMany({
          where: {
            projectId: { in: projectIdsArray },
          },
          include: {
            project: {
              select: { id: true, projectCode: true, title: true, status: true },
            },
            uploadedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      );
    }

    // Merge uploadedDeliverables and projectDeliverables uniquely
    const deliverableMap = new Map<string, any>();
    for (const d of creator.uploadedDeliverables) {
      deliverableMap.set(d.id, d);
    }
    for (const d of projectDeliverables) {
      if (!deliverableMap.has(d.id)) {
        deliverableMap.set(d.id, d);
      }
    }

    const allDeliverables = Array.from(deliverableMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.json({
      success: true,
      data: {
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          image: creator.image,
          appRole: creator.appRole,
          emailVerified: creator.emailVerified,
          createdAt: creator.createdAt,
          updatedAt: creator.updatedAt,
        },
        stats: {
          totalProjects: allProjectIds.size,
          activeProjectsCount: activeProjects.length,
          completedProjectsCount: projectHistory.filter((p) => p.status === "COMPLETED").length,
          deliverablesCount: allDeliverables.length,
        },
        activeProjects,
        projectHistory,
        deliverables: allDeliverables,
      },
    });
  } catch (error: any) {
    console.error("[GET CREATOR PORTFOLIO DETAIL ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load creator portfolio.",
      error: error?.message,
    });
  }
};
