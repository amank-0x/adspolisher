import { Router, type Request, type Response } from "express";
import { z } from "zod";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { sendCreatorApplicationEmail } from "../utils/sendCreatorApplicationEmail.js";

const creatorApplicationRouter: Router = Router();
const adminCreatorApplicationRouter: Router = Router();

const creatorApplicationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  location: z.string().trim().min(1).max(160),
  portfolioUrl: z.string().trim().min(1).max(500),
  secondaryUrl: z.string().trim().max(500).optional().nullable(),
  craftSpecialty: z.string().trim().min(1).max(180),
  primaryTools: z.string().trim().min(1).max(500),
  experienceLevel: z.string().trim().min(1).max(120),
  weeklyAvailability: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(5000).optional().nullable(),
  fileSummaries: z.array(z.object({
    name: z.string().max(240),
    size: z.number().nonnegative(),
    type: z.string().max(120),
  })).max(10).optional().nullable(),
});

const reviewSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  reviewNotes: z.string().trim().max(3000).optional().nullable(),
});

// POST /api/v1/creator-applications
creatorApplicationRouter.post("/", async (req: Request, res: Response) => {
  const parsed = creatorApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Please check the required application fields.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const application = await withDatabaseRetry(() =>
      prismaClient.creatorApplication.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          location: parsed.data.location,
          portfolioUrl: parsed.data.portfolioUrl,
          craftSpecialty: parsed.data.craftSpecialty,
          primaryTools: parsed.data.primaryTools,
          experienceLevel: parsed.data.experienceLevel,
          weeklyAvailability: parsed.data.weeklyAvailability,
          secondaryUrl: parsed.data.secondaryUrl || null,
          notes: parsed.data.notes || null,
          ...(parsed.data.fileSummaries ? { fileSummaries: parsed.data.fileSummaries } : {}),
        },
      }),
    );

    return res.status(201).json({
      success: true,
      message: "Creator application submitted successfully.",
      data: { id: application.id, status: application.status },
    });
  } catch (error) {
    console.error("[CREATOR APPLICATION CREATE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "We could not save your application right now. Please try again.",
    });
  }
});

// GET /api/v1/admin/creator-applications?status=PENDING
adminCreatorApplicationRouter.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === "string" && req.query.status !== "ALL"
      ? req.query.status
      : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const where: any = {};
    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      where.status = status as "PENDING" | "APPROVED" | "REJECTED";
    } else {
      where.status = "PENDING";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { craftSpecialty: { contains: search, mode: "insensitive" } },
      ];
    }

    const applications = await withDatabaseRetry(() =>
      prismaClient.creatorApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          reviewedBy: { select: { id: true, name: true, email: true } },
        },
      }),
    );

    return res.json({ success: true, data: applications, total: applications.length });
  } catch (error) {
    console.error("[ADMIN CREATOR APPLICATIONS GET ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load creator applications." });
  }
});

// PATCH /api/v1/admin/creator-applications/:id
adminCreatorApplicationRouter.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = reviewSchema.safeParse(req.body);
  if (!id || !parsed.success) {
    return res.status(400).json({ success: false, message: "Status and review notes are required in a valid format." });
  }

  try {
    const application = await prismaClient.creatorApplication.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ success: false, message: "Creator application not found." });

    const reviewedAt = new Date();
    const adminUserId = String(res.locals.adminUserId);
    const decisionEmailStatus: "APPROVED" | "REJECTED" | null = application.status !== parsed.data.status
      && (parsed.data.status === "APPROVED" || parsed.data.status === "REJECTED")
      ? parsed.data.status
      : null;
    const result = await prismaClient.$transaction(async (transaction) => {
      let promotedUserId: string | null = null;

      if (parsed.data.status === "APPROVED") {
        const existingUser = await transaction.user.findUnique({ where: { email: application.email } });
        if (existingUser) {
          promotedUserId = existingUser.id;
          if (existingUser.appRole === "CUSTOMER") {
            await transaction.user.update({
              where: { id: existingUser.id },
              data: { appRole: "CREATOR" },
            });
          }
        } else {
          const createdUser = await transaction.user.create({
            data: {
              name: application.name,
              email: application.email,
              appRole: "CREATOR",
            },
          });
          promotedUserId = createdUser.id;
        }
      }

      const updatedApplication =
        parsed.data.status === "REJECTED" || parsed.data.status === "APPROVED"
          ? await transaction.creatorApplication.delete({ where: { id } })
          : await transaction.creatorApplication.update({
              where: { id },
              data: {
                status: parsed.data.status,
                reviewNotes: parsed.data.reviewNotes ?? null,
                reviewedAt,
                reviewedById: adminUserId,
              },
              include: {
                reviewedBy: { select: { id: true, name: true, email: true } },
              },
            });

      await transaction.auditLog.create({
        data: {
          actorId: adminUserId,
          action: `CREATOR_APPLICATION_${parsed.data.status}`,
          targetType: "CreatorApplication",
          targetId: id,
          metadata: {
            applicantEmail: application.email,
            promotedUserId,
          },
        },
      });

      return updatedApplication;
    });

    let emailSent = false;
    if (decisionEmailStatus) {
      try {
        const baseUrl = process.env.NEXT_APP_URL || "http://localhost:3000";
        await sendCreatorApplicationEmail(application.email, {
          applicantName: application.name,
          status: decisionEmailStatus,
          creatorLoginUrl: `${baseUrl.replace(/\/$/, "")}/creator/login`,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("[CREATOR APPLICATION EMAIL ERROR]", emailError);
      }
    }

    return res.json({
      success: true,
      message: parsed.data.status === "APPROVED"
        ? emailSent ? "Application approved, creator access granted, and removed from application queue." : "Application approved and creator access granted, but the welcome email could not be sent."
        : parsed.data.status === "REJECTED"
          ? emailSent ? "Application rejected and notification email sent." : "Application rejected, but the notification email could not be sent."
          : "Application moved back to pending.",
      emailSent,
      data: parsed.data.status === "REJECTED" || parsed.data.status === "APPROVED" ? null : result,
    });
  } catch (error) {
    console.error("[ADMIN CREATOR APPLICATION REVIEW ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update creator application." });
  }
});

export default creatorApplicationRouter;
export { adminCreatorApplicationRouter };
