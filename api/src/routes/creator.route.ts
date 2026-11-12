import { Router, type Request, type Response } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { requireCreator } from "../middleware/requireCreator.js";
import { z } from "zod";
import bcrypt from "bcrypt";

const creatorRouter: Router = Router();

creatorRouter.get("/offers", requireCreator, async (_req: Request, res: Response) => {
  try {
    const offers = await prismaClient.projectOffer.findMany({
      where: { creatorId: String(res.locals.userId) },
      orderBy: { createdAt: "desc" },
      include: { project: { select: { id: true, projectCode: true, title: true, status: true } }, negotiation: { orderBy: { createdAt: "asc" } } },
    });
    return res.json({ success: true, data: offers });
  } catch (error) {
    console.error("[CREATOR OFFERS GET ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load project requests." });
  }
});

const offerResponseSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("ACCEPT") }),
  z.object({ action: z.literal("DECLINE"), message: z.string().trim().max(1000).optional() }),
  z.object({ action: z.literal("COUNTER"), amount: z.number().positive(), message: z.string().trim().min(1).max(2000) }),
]);

creatorRouter.patch("/offers/:id/respond", requireCreator, async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = offerResponseSchema.safeParse(req.body);
  if (!id || !parsed.success) return res.status(400).json({ success: false, message: "Check your response and any counter-offer details." });
  const creatorId = String(res.locals.userId);
  try {
    const offer = await prismaClient.projectOffer.findFirst({ where: { id, creatorId }, include: { project: true } });
    if (!offer) return res.status(404).json({ success: false, message: "Project offer not found." });
    if (!["SENT", "COUNTERED_BY_ADMIN"].includes(offer.status)) return res.status(409).json({ success: false, message: "This offer is not awaiting your response." });
    if (offer.expiresAt && offer.expiresAt <= new Date()) {
      await prismaClient.projectOffer.update({ where: { id }, data: { status: "EXPIRED" } });
      return res.status(410).json({ success: false, message: "This offer has expired." });
    }
    if (parsed.data.action === "COUNTER" && offer.currentRound >= offer.maxRounds) return res.status(409).json({ success: false, message: "The maximum negotiation rounds have been reached." });
    const updated = await prismaClient.$transaction(async (tx) => {
      const action = parsed.data.action;
      const nextStatus = action === "ACCEPT" ? "ACCEPTED" : action === "DECLINE" ? "DECLINED" : "COUNTERED_BY_CREATOR";
      const nextRound = action === "COUNTER" ? offer.currentRound + 1 : offer.currentRound;
      const amount = action === "COUNTER" ? parsed.data.amount : action === "ACCEPT" ? offer.currentAmount : null;
      const row = await tx.projectOffer.update({ where: { id }, data: { status: nextStatus, currentRound: nextRound, ...(action === "COUNTER" ? { currentAmount: parsed.data.amount } : {}), ...(action === "ACCEPT" ? { acceptedAmount: offer.currentAmount } : {}), ...(action === "DECLINE" ? { declineReason: parsed.data.message || null } : {}), respondedAt: new Date() } });
      await tx.offerNegotiationEntry.create({ data: { offerId: id, round: nextRound, action, actorRole: "CREATOR", actorId: creatorId, amount, message: action === "COUNTER" ? parsed.data.message : action === "DECLINE" ? parsed.data.message || null : null } });
      if (action === "ACCEPT") {
        await tx.projectTeamMember.upsert({ where: { projectId_userId: { projectId: offer.projectId, userId: creatorId } }, update: { roleTitle: offer.roleTitle, offerId: id }, create: { projectId: offer.projectId, userId: creatorId, roleTitle: offer.roleTitle, offerId: id } });
        const project = await tx.project.findUnique({ where: { id: offer.projectId }, select: { assignedToId: true } });
        if (project && !project.assignedToId) await tx.project.update({ where: { id: offer.projectId }, data: { assignedToId: creatorId } });
      }
      return row;
    });
    return res.json({ success: true, message: parsed.data.action === "ACCEPT" ? "Offer accepted. The project is now in your workspace." : parsed.data.action === "DECLINE" ? "Offer declined." : "Counter-offer sent to the admin team.", data: updated });
  } catch (error) {
    console.error("[CREATOR OFFER RESPONSE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to submit your offer response." });
  }
});

// Validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().trim().nullable().optional(),
  location: z.string().trim().optional(),
  craftSpecialty: z.string().trim().optional(),
  primaryTools: z.string().trim().optional(),
  experienceLevel: z.string().trim().optional(),
  weeklyAvailability: z.string().trim().optional(),
  portfolioUrl: z.string().trim().optional(),
  secondaryUrl: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  notificationPreferences: z
    .object({
      sprintInvites: z.boolean().optional(),
      reviews: z.boolean().optional(),
      messages: z.boolean().optional(),
      payouts: z.boolean().optional(),
    })
    .optional(),
});

// Validation schema for password change
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

/**
 * GET /api/v1/creator/portfolio - Creator's full activity, projects, ongoing projects, and deliverables
 */
creatorRouter.get("/portfolio", requireCreator, async (_req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const user = await withDatabaseRetry(() =>
      prismaClient.user.findUnique({
        where: { id: userId },
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
                include: {
                  client: { select: { id: true, name: true } },
                  _count: { select: { deliverables: true } },
                },
              },
            },
            orderBy: { joinedAt: "desc" },
          },
          assignedProjects: {
            include: {
              client: { select: { id: true, name: true } },
              _count: { select: { deliverables: true } },
            },
            orderBy: { createdAt: "desc" },
          },
          uploadedDeliverables: {
            include: {
              project: { select: { id: true, projectCode: true, title: true, status: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      })
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "Creator account not found." });
    }

    // Also fetch creator application details for craft metadata
    const application = await withDatabaseRetry(() =>
      prismaClient.creatorApplication.findFirst({
        where: { email: { equals: user.email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      })
    );

    // Consolidate unique projects
    const allProjectMap = new Map<string, any>();

    for (const m of user.projectMemberships) {
      const p = m.project;
      if (!p || allProjectMap.has(p.id)) continue;
      allProjectMap.set(p.id, {
        id: p.id,
        projectCode: p.projectCode,
        title: p.title,
        brief: p.brief,
        status: p.status,
        roleTitle: m.roleTitle || "Creator / Pod Member",
        startDate: p.startDate,
        dueDate: p.dueDate,
        completedAt: p.completedAt,
        joinedAt: m.joinedAt,
        clientName: p.client?.name || "Client Brand",
        deliverablesCount: p._count?.deliverables || 0,
      });
    }

    for (const p of user.assignedProjects) {
      if (!p || allProjectMap.has(p.id)) continue;
      allProjectMap.set(p.id, {
        id: p.id,
        projectCode: p.projectCode,
        title: p.title,
        brief: p.brief,
        status: p.status,
        roleTitle: "Lead Creator / Assignee",
        startDate: p.startDate,
        dueDate: p.dueDate,
        completedAt: p.completedAt,
        joinedAt: p.createdAt,
        clientName: p.client?.name || "Client Brand",
        deliverablesCount: p._count?.deliverables || 0,
      });
    }

    const allProjects = Array.from(allProjectMap.values());
    const ongoingStatuses = ["INTAKE", "PLANNED", "IN_PROGRESS", "IN_REVIEW", "WAITING_FOR_CLIENT", "ON_HOLD"];
    const ongoingProjects = allProjects.filter((p) => ongoingStatuses.includes(p.status));
    const completedProjects = allProjects.filter((p) => p.status === "COMPLETED");

    // Deliverables summary
    const deliverables = user.uploadedDeliverables.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      fileUrl: d.fileUrl,
      previewUrl: d.previewUrl,
      version: d.version,
      status: d.status,
      createdAt: d.createdAt,
      projectCode: d.project?.projectCode || "AP",
      projectTitle: d.project?.title || "Asset",
      projectId: d.project?.id || "",
    }));

    const approvedDeliverablesCount = deliverables.filter((d) => d.status === "APPROVED").length;

    // Build chronological activity timeline
    const activityTimeline: any[] = [];

    // Project joins
    for (const p of allProjects) {
      activityTimeline.push({
        id: `project-${p.id}`,
        type: "PROJECT_ASSIGNMENT",
        title: `Joined ${p.title}`,
        detail: `Role: ${p.roleTitle} · Code: ${p.projectCode}`,
        status: p.status,
        date: p.joinedAt || p.startDate || new Date().toISOString(),
      });
    }

    // Deliverables uploaded
    for (const d of deliverables) {
      activityTimeline.push({
        id: `deliverable-${d.id}`,
        type: "DELIVERABLE_UPLOAD",
        title: `Uploaded Asset v${d.version}: ${d.title}`,
        detail: `Project: ${d.projectTitle} · Review: ${d.status}`,
        status: d.status,
        date: d.createdAt,
      });
    }

    activityTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return res.json({
      success: true,
      data: {
        creator: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          appRole: user.appRole,
          createdAt: user.createdAt,
        },
        craftDetails: application
          ? {
              craftSpecialty: application.craftSpecialty,
              primaryTools: application.primaryTools,
              experienceLevel: application.experienceLevel,
              weeklyAvailability: application.weeklyAvailability,
              portfolioUrl: application.portfolioUrl,
              secondaryUrl: application.secondaryUrl,
              location: application.location,
              notes: application.notes,
            }
          : {
              craftSpecialty: "Creative Designer & Art Director",
              primaryTools: "",
              experienceLevel: "Mid-Level Specialist",
              weeklyAvailability: "Flexible",
              portfolioUrl: "",
              secondaryUrl: null,
              location: "Global Remote",
              notes: null,
            },
        stats: {
          totalProjects: allProjects.length,
          ongoingProjects: ongoingProjects.length,
          completedProjects: completedProjects.length,
          totalDeliverables: deliverables.length,
          approvedDeliverables: approvedDeliverablesCount,
        },
        ongoingProjects,
        completedProjects,
        allProjects,
        deliverables,
        activityTimeline: activityTimeline.slice(0, 20),
      },
    });
  } catch (error: any) {
    console.error("[CREATOR PORTFOLIO GET ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load creator portfolio.", error: error?.message });
  }
});

/**
 * GET /api/v1/creator/profile - Get creator profile and craft information
 */
creatorRouter.get("/profile", requireCreator, async (_req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const user = await withDatabaseRetry(() =>
      prismaClient.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          appRole: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              projectMemberships: true,
              assignedProjects: true,
              uploadedDeliverables: true,
            },
          },
        },
      })
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const application = await withDatabaseRetry(() =>
      prismaClient.creatorApplication.findFirst({
        where: { email: { equals: user.email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      })
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          appRole: user.appRole,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        },
        application: application
          ? {
              id: application.id,
              location: application.location,
              craftSpecialty: application.craftSpecialty,
              primaryTools: application.primaryTools,
              experienceLevel: application.experienceLevel,
              weeklyAvailability: application.weeklyAvailability,
              portfolioUrl: application.portfolioUrl,
              secondaryUrl: application.secondaryUrl,
              notes: application.notes,
              status: application.status,
              notificationPreferences:
                (application.fileSummaries as any)?.notificationPreferences || {
                  sprintInvites: true,
                  reviews: true,
                  messages: true,
                  payouts: true,
                },
            }
          : {
              id: null,
              location: "Global Remote",
              craftSpecialty: "Motion Graphics & 3D Ads",
              primaryTools: "Figma, Adobe Suite",
              experienceLevel: "Mid-Level Specialist (3–5 yrs)",
              weeklyAvailability: "20–30 hrs/week (Dedicated half-time)",
              portfolioUrl: "",
              secondaryUrl: null,
              notes: null,
              status: "APPROVED",
              notificationPreferences: {
                sprintInvites: true,
                reviews: true,
                messages: true,
                payouts: true,
              },
            },
        stats: {
          totalProjects: user._count.projectMemberships + user._count.assignedProjects,
          deliverablesCount: user._count.uploadedDeliverables,
        },
      },
    });
  } catch (error: any) {
    console.error("[CREATOR PROFILE GET ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load profile.", error: error?.message });
  }
});

/**
 * PATCH /api/v1/creator/profile - Update creator personal & craft profile
 */
creatorRouter.patch("/profile", requireCreator, async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid profile data.",
      });
    }

    const {
      name,
      image,
      location,
      craftSpecialty,
      primaryTools,
      experienceLevel,
      weeklyAvailability,
      portfolioUrl,
      secondaryUrl,
      notes,
      notificationPreferences,
    } = parsed.data;

    // Update User table
    const userUpdate: any = {};
    if (name !== undefined) userUpdate.name = name;
    if (image !== undefined) userUpdate.image = image;

    const updatedUser = await withDatabaseRetry(() =>
      prismaClient.user.update({
        where: { id: userId },
        data: userUpdate,
        select: { id: true, name: true, email: true, image: true, appRole: true },
      })
    );

    // Update or create CreatorApplication record for craft details
    const existingApp = await prismaClient.creatorApplication.findFirst({
      where: { email: { equals: updatedUser.email, mode: "insensitive" } },
    });

    let updatedApp = null;
    if (existingApp) {
      const appUpdate: any = {};
      if (location !== undefined) appUpdate.location = location;
      if (craftSpecialty !== undefined) appUpdate.craftSpecialty = craftSpecialty;
      if (primaryTools !== undefined) appUpdate.primaryTools = primaryTools;
      if (experienceLevel !== undefined) appUpdate.experienceLevel = experienceLevel;
      if (weeklyAvailability !== undefined) appUpdate.weeklyAvailability = weeklyAvailability;
      if (portfolioUrl !== undefined) appUpdate.portfolioUrl = portfolioUrl;
      if (secondaryUrl !== undefined) appUpdate.secondaryUrl = secondaryUrl;
      if (notes !== undefined) appUpdate.notes = notes;
      if (notificationPreferences !== undefined) {
        const existingSummary = (existingApp.fileSummaries as any) || {};
        appUpdate.fileSummaries = {
          ...existingSummary,
          notificationPreferences: {
            ...existingSummary.notificationPreferences,
            ...notificationPreferences,
          },
        };
      }

      updatedApp = await withDatabaseRetry(() =>
        prismaClient.creatorApplication.update({
          where: { id: existingApp.id },
          data: appUpdate,
        })
      );
    } else if (craftSpecialty || primaryTools || location || portfolioUrl) {
      updatedApp = await withDatabaseRetry(() =>
        prismaClient.creatorApplication.create({
          data: {
            name: updatedUser.name,
            email: updatedUser.email,
            location: location || "Global",
            craftSpecialty: craftSpecialty || "Creative Design",
            primaryTools: primaryTools || "Figma, Adobe Suite",
            experienceLevel: experienceLevel || "Experienced",
            weeklyAvailability: weeklyAvailability || "Flexible",
            portfolioUrl: portfolioUrl || "https://adspolisher.com",
            secondaryUrl: secondaryUrl || null,
            notes: notes || null,
            status: "APPROVED",
          },
        })
      );
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: updatedUser,
        application: updatedApp,
      },
    });
  } catch (error: any) {
    console.error("[CREATOR PROFILE UPDATE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update profile.", error: error?.message });
  }
});

/**
 * PATCH /api/v1/creator/settings/password - Change creator password
 */
creatorRouter.patch("/settings/password", requireCreator, async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid password data.",
      });
    }

    const { currentPassword, newPassword } = parsed.data;

    // Find the credential account for this user
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: { providerId: "credential" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const credentialAccount = user.accounts[0];
    if (credentialAccount && credentialAccount.password) {
      const isValid = await bcrypt.compare(currentPassword, credentialAccount.password);
      if (!isValid) {
        return res.status(400).json({ success: false, message: "Current password does not match." });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prismaClient.account.update({
        where: { id: credentialAccount.id },
        data: { password: hashed },
      });
    } else {
      // User signed up with OAuth or doesn't have a credential account yet, create one
      const hashed = await bcrypt.hash(newPassword, 10);
      await prismaClient.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          accountId: user.email,
          password: hashed,
        },
      });
    }

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    console.error("[CHANGE PASSWORD ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to change password.", error: error?.message });
  }
});

/**
 * PATCH /api/v1/creator/settings/avatar - Update avatar image
 */
creatorRouter.patch("/settings/avatar", requireCreator, async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const { imageUrl } = req.body;
    if (typeof imageUrl !== "string" && imageUrl !== null) {
      return res.status(400).json({ success: false, message: "Invalid image URL." });
    }

    const updated = await withDatabaseRetry(() =>
      prismaClient.user.update({
        where: { id: userId },
        data: { image: imageUrl },
        select: { id: true, name: true, email: true, image: true },
      })
    );

    return res.json({
      success: true,
      message: "Profile image updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[AVATAR UPDATE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update profile image.", error: error?.message });
  }
});

/**
 * PATCH /api/v1/creator/settings/notifications - Save creator notification preferences
 */
creatorRouter.patch("/settings/notifications", requireCreator, async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const existingApp = await prismaClient.creatorApplication.findFirst({
      where: { email: { equals: user.email, mode: "insensitive" } },
    });

    const { sprintInvites, reviews, messages, payouts } = req.body;
    const preferences = {
      sprintInvites: sprintInvites ?? true,
      reviews: reviews ?? true,
      messages: messages ?? true,
      payouts: payouts ?? true,
    };

    if (existingApp) {
      const existingSummary = (existingApp.fileSummaries as any) || {};
      await withDatabaseRetry(() =>
        prismaClient.creatorApplication.update({
          where: { id: existingApp.id },
          data: {
            fileSummaries: {
              ...existingSummary,
              notificationPreferences: preferences,
            },
          },
        })
      );
    } else {
      await withDatabaseRetry(() =>
        prismaClient.creatorApplication.create({
          data: {
            name: "Creator",
            email: user.email,
            location: "Global",
            craftSpecialty: "Creator",
            primaryTools: "Tools",
            experienceLevel: "Mid-Level",
            weeklyAvailability: "Flexible",
            portfolioUrl: "https://adspolisher.com",
            status: "APPROVED",
            fileSummaries: {
              notificationPreferences: preferences,
            },
          },
        })
      );
    }

    return res.json({
      success: true,
      message: "Notification preferences updated successfully.",
      data: preferences,
    });
  } catch (error: any) {
    console.error("[NOTIFICATIONS UPDATE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update notification preferences.", error: error?.message });
  }
});

export default creatorRouter;
