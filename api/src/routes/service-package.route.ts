import { Router, type Request, type Response } from "express";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { z } from "zod";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { Prisma } from "@prisma/client";

export const packageRouter: Router = Router();
export const serviceRouter: Router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------
// SCHEMAS
// ---------------------------------------------

const createPackageSchema = z.object({
  name: z.string().trim().min(2, "Package name is required"),
  slug: z.string().trim().optional(),
  tagline: z.string().trim().optional().nullable(),
  badge: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  price: z.union([z.number(), z.string().transform((v) => parseFloat(v))]),
  currency: z.string().trim().max(5).default("INR"),
  billingPeriod: z.string().trim().default("one-time"),
  deliverables: z.array(z.string()).min(1, "At least one service/deliverable is required"),
  turnaroundDays: z.number().int().positive().optional().nullable(),
  revisionLimit: z.number().int().optional().nullable(),
  isPopular: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  serviceId: z.string().trim().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

const updatePackageSchema = z.object({
  name: z.string().trim().min(2).optional(),
  slug: z.string().trim().optional(),
  tagline: z.string().trim().nullable().optional(),
  badge: z.string().trim().nullable().optional(),
  description: z.string().trim().min(5).optional(),
  price: z.union([z.number(), z.string().transform((v) => parseFloat(v))]).optional(),
  currency: z.string().trim().max(5).optional(),
  billingPeriod: z.string().trim().optional(),
  deliverables: z.array(z.string()).min(1).optional(),
  turnaroundDays: z.number().int().nullable().optional(),
  revisionLimit: z.number().int().nullable().optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  serviceId: z.string().trim().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

const createServiceSchema = z.object({
  name: z.string().trim().min(2, "Service name is required"),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().min(3, "Short description is required"),
  description: z.string().trim().min(5, "Full description is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  coverImageUrl: z.string().trim().optional().nullable(),
});

const updateServiceSchema = createServiceSchema.partial();

// ---------------------------------------------
// PACKAGES ROUTES
// ---------------------------------------------

/**
 * GET /api/v1/packages - List all packages
 */
packageRouter.get("/", async (req: Request, res: Response) => {
  try {
    const onlyActive = req.query.all !== "true";
    const serviceId = typeof req.query.serviceId === "string" ? req.query.serviceId : undefined;

    const where: Prisma.ServicePackageWhereInput = {};
    if (onlyActive) {
      where.isActive = true;
    }
    if (serviceId) {
      where.serviceId = serviceId;
    }

    const packages = await withDatabaseRetry(() =>
      prismaClient.servicePackage.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
        include: {
          service: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { projects: true, quoteRequests: true },
          },
        },
      })
    );

    return res.json({ success: true, data: packages });
  } catch (error: any) {
    console.error("[GET PACKAGES ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load packages.", error: error?.message });
  }
});

/**
 * GET /api/v1/packages/:id - Get specific package
 */
packageRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const pkg = await withDatabaseRetry(() =>
      prismaClient.servicePackage.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: {
          service: true,
          _count: {
            select: { projects: true, quoteRequests: true },
          },
        },
      })
    );

    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }

    return res.json({ success: true, data: pkg });
  } catch (error: any) {
    console.error("[GET PACKAGE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load package.", error: error?.message });
  }
});

/**
 * POST /api/v1/packages - Admin create package
 */
packageRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = createPackageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid package data.",
        errors: parsed.error.issues,
      });
    }

    const {
      name,
      slug: customSlug,
      tagline,
      badge,
      description,
      price,
      currency,
      billingPeriod,
      deliverables,
      turnaroundDays,
      revisionLimit,
      isPopular,
      isActive,
      serviceId,
      sortOrder,
    } = parsed.data;

    let finalSlug = customSlug ? slugify(customSlug) : slugify(name);
    const existing = await prismaClient.servicePackage.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const newPackage = await withDatabaseRetry(() =>
      prismaClient.servicePackage.create({
        data: {
          name,
          slug: finalSlug,
          tagline: tagline ?? null,
          badge: badge ?? null,
          description: description?.trim() || tagline?.trim() || `Package including ${deliverables.slice(0, 3).join(", ")}.`,
          price: new Prisma.Decimal(price),
          currency: currency.toUpperCase(),
          billingPeriod: billingPeriod || "one-time",
          deliverables,
          turnaroundDays: turnaroundDays ?? null,
          revisionLimit: revisionLimit ?? null,
          isPopular: !!isPopular,
          isActive: isActive !== false,
          serviceId: serviceId ?? null,
          sortOrder: sortOrder ?? 0,
        },
        include: {
          service: true,
        },
      })
    );

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: newPackage,
    });
  } catch (error: any) {
    console.error("[CREATE PACKAGE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to create package.", error: error?.message });
  }
});

/**
 * PATCH /api/v1/packages/:id - Admin update package
 */
packageRouter.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const parsed = updatePackageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid package update data.",
        errors: parsed.error.issues,
      });
    }

    const existing = await prismaClient.servicePackage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }

    const updateData: Prisma.ServicePackageUpdateInput = {};
    const d = parsed.data;

    if (d.name !== undefined) updateData.name = d.name;
    if (d.slug !== undefined) updateData.slug = slugify(d.slug || d.name || existing.name);
    if (d.tagline !== undefined) updateData.tagline = d.tagline ?? null;
    if (d.badge !== undefined) updateData.badge = d.badge ?? null;
    if (d.description !== undefined) updateData.description = d.description;
    if (d.price !== undefined) updateData.price = new Prisma.Decimal(d.price);
    if (d.currency !== undefined) updateData.currency = d.currency.toUpperCase();
    if (d.billingPeriod !== undefined) updateData.billingPeriod = d.billingPeriod;
    if (d.deliverables !== undefined) updateData.deliverables = d.deliverables;
    if (d.turnaroundDays !== undefined) updateData.turnaroundDays = d.turnaroundDays ?? null;
    if (d.revisionLimit !== undefined) updateData.revisionLimit = d.revisionLimit ?? null;
    if (d.isPopular !== undefined) updateData.isPopular = d.isPopular;
    if (d.isActive !== undefined) updateData.isActive = d.isActive;
    if (d.sortOrder !== undefined) updateData.sortOrder = d.sortOrder;
    if (d.serviceId !== undefined) {
      updateData.service = d.serviceId ? { connect: { id: d.serviceId } } : { disconnect: true };
    }

    const updated = await withDatabaseRetry(() =>
      prismaClient.servicePackage.update({
        where: { id },
        data: updateData,
        include: { service: true },
      })
    );

    return res.json({
      success: true,
      message: "Package updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[UPDATE PACKAGE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update package.", error: error?.message });
  }
});

/**
 * DELETE /api/v1/packages/:id - Admin delete package
 */
packageRouter.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prismaClient.servicePackage.findUnique({
      where: { id },
      include: { _count: { select: { projects: true, quoteRequests: true } } },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }

    if (existing._count.projects > 0 || existing._count.quoteRequests > 0) {
      const archived = await prismaClient.servicePackage.update({
        where: { id },
        data: { isActive: false },
      });
      return res.json({
        success: true,
        message: "Package has existing projects/inquiries and was archived (set inactive).",
        data: archived,
      });
    }

    await withDatabaseRetry(() => prismaClient.servicePackage.delete({ where: { id } }));

    return res.json({ success: true, message: "Package deleted successfully." });
  } catch (error: any) {
    console.error("[DELETE PACKAGE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to delete package.", error: error?.message });
  }
});

/**
 * POST /api/v1/packages/seed-defaults - Seed initial packages (e.g. 5K, 15K, 35K)
 */
packageRouter.post("/seed-defaults", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const defaultPackages = [
      {
        name: "5K All-in-One Business Kickstart",
        slug: "5k-all-in-one-kickstart",
        tagline: "Essential creative ads, Google indexing & social media management",
        badge: "Special 5K Deal",
        description:
          "Everything your business needs to launch with momentum: 5 high-converting creative ads, Google Search indexing & Console setup, 30 days of active social media management, and 12 custom engaging social posts.",
        price: new Prisma.Decimal(5000),
        currency: "INR",
        billingPeriod: "one-time",
        deliverables: [
          "5 High-Converting Creative Ads (Feed & Story formats)",
          "Google Search Indexing & Search Console Setup",
          "Social Media Management (30 Days active coverage)",
          "12 Custom Social Media Posts with Copy & Hashtags",
          "Brand Hook & Ad Angle Strategy",
          "2 Iteration Rounds Included",
        ],
        turnaroundDays: 7,
        revisionLimit: 2,
        isPopular: true,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "15K Growth & Performance Accelerator",
        slug: "15k-growth-accelerator",
        tagline: "Double your inbound reach with omnichannel creative production",
        badge: "Most Popular",
        description:
          "For expanding businesses ready to scale conversions: 15 multi-platform ad creatives, comprehensive local SEO & Google indexing, multi-network social media management, and 24 custom posts.",
        price: new Prisma.Decimal(15000),
        currency: "INR",
        billingPeriod: "monthly",
        deliverables: [
          "15 Multi-Platform Ad Creatives (Static, Carousel & Video Cuts)",
          "Full Google Search Indexing, Meta Tags & SEO Optimization",
          "Full Social Media Management (Instagram, Facebook & LinkedIn)",
          "24 Custom Designed Social Media Posts & Stories",
          "A/B Creative Hook Testing & Audience Angle Variations",
          "Dedicated Art Director & Weekly Performance Reports",
          "4 Iteration Rounds Included",
        ],
        turnaroundDays: 14,
        revisionLimit: 4,
        isPopular: false,
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "35K Omnichannel Creative Engine",
        slug: "35k-omnichannel-suite",
        tagline: "Complete dedicated design department on demand",
        badge: "Enterprise Growth",
        description:
          "High-volume creative production and full-funnel digital presence. Unlimited creative revisions, daily managed social engagement, technical Google indexing, and over 40 bespoke visual assets.",
        price: new Prisma.Decimal(35000),
        currency: "INR",
        billingPeriod: "monthly",
        deliverables: [
          "30+ High-Production Ad Assets, Motion Graphics & Video Edits",
          "Complete Google Indexing, Site Architecture & Speed Optimization",
          "End-to-End Social Media Management & Community Engagement",
          "40 Bespoke Social Media Posts & Carousel Decks",
          "Dedicated Slack Channel with Art Director & Copywriter",
          "Competitor Creative Intelligence & Ad Library Audits",
          "Unlimited Creative Revisions",
        ],
        turnaroundDays: 21,
        revisionLimit: 99,
        isPopular: false,
        isActive: true,
        sortOrder: 3,
      },
    ];

    const results = [];
    for (const pkg of defaultPackages) {
      const existing = await prismaClient.servicePackage.findUnique({ where: { slug: pkg.slug } });
      if (!existing) {
        const created = await prismaClient.servicePackage.create({ data: pkg });
        results.push(created);
      } else {
        results.push(existing);
      }
    }

    return res.json({
      success: true,
      message: `Seeded ${results.length} packages.`,
      data: results,
    });
  } catch (error: any) {
    console.error("[SEED PACKAGES ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to seed default packages.", error: error?.message });
  }
});

// ---------------------------------------------
// SERVICES ROUTES
// ---------------------------------------------

/**
 * GET /api/v1/services - List all service categories
 */
serviceRouter.get("/", async (req: Request, res: Response) => {
  try {
    const onlyPublished = req.query.all !== "true";
    const where: Prisma.ServiceWhereInput = {};
    if (onlyPublished) {
      where.status = "PUBLISHED";
    }

    const services = await withDatabaseRetry(() =>
      prismaClient.service.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        include: {
          packages: {
            where: onlyPublished ? { isActive: true } : {},
            orderBy: { sortOrder: "asc" },
          },
          _count: { select: { packages: true, projects: true } },
        },
      })
    );

    return res.json({ success: true, data: services });
  } catch (error: any) {
    console.error("[GET SERVICES ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load services.", error: error?.message });
  }
});

/**
 * POST /api/v1/services - Admin create service
 */
serviceRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = createServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid service data.",
        errors: parsed.error.issues,
      });
    }

    const { name, slug: customSlug, shortDescription, description, status, featured, sortOrder, coverImageUrl } =
      parsed.data;

    let finalSlug = customSlug ? slugify(customSlug) : slugify(name);
    const existing = await prismaClient.service.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const service = await withDatabaseRetry(() =>
      prismaClient.service.create({
        data: {
          name,
          slug: finalSlug,
          shortDescription,
          description,
          status,
          featured,
          sortOrder,
          coverImageUrl: coverImageUrl ?? null,
        },
      })
    );

    return res.status(201).json({ success: true, message: "Service created successfully.", data: service });
  } catch (error: any) {
    console.error("[CREATE SERVICE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to create service.", error: error?.message });
  }
});

/**
 * PATCH /api/v1/services/:id - Admin update service
 */
serviceRouter.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const parsed = updateServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid service update data.",
        errors: parsed.error.issues,
      });
    }

    const existing = await prismaClient.service.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    const updateData: Prisma.ServiceUpdateInput = {};
    const d = parsed.data;
    if (d.name !== undefined) updateData.name = d.name;
    if (d.slug !== undefined) updateData.slug = slugify(d.slug || d.name || existing.name);
    if (d.shortDescription !== undefined) updateData.shortDescription = d.shortDescription;
    if (d.description !== undefined) updateData.description = d.description;
    if (d.status !== undefined) updateData.status = d.status;
    if (d.featured !== undefined) updateData.featured = d.featured;
    if (d.sortOrder !== undefined) updateData.sortOrder = d.sortOrder;
    if (d.coverImageUrl !== undefined) updateData.coverImageUrl = d.coverImageUrl ?? null;

    const updated = await withDatabaseRetry(() =>
      prismaClient.service.update({
        where: { id },
        data: updateData,
      })
    );

    return res.json({ success: true, message: "Service updated successfully.", data: updated });
  } catch (error: any) {
    console.error("[UPDATE SERVICE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update service.", error: error?.message });
  }
});

/**
 * DELETE /api/v1/services/:id - Admin delete service
 */
serviceRouter.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prismaClient.service.findUnique({
      where: { id },
      include: { _count: { select: { packages: true, projects: true } } },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    if (existing._count.packages > 0 || existing._count.projects > 0) {
      const archived = await prismaClient.service.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
      return res.json({
        success: true,
        message: "Service has linked packages/projects and was archived instead of deleted.",
        data: archived,
      });
    }

    await withDatabaseRetry(() => prismaClient.service.delete({ where: { id } }));
    return res.json({ success: true, message: "Service deleted successfully." });
  } catch (error: any) {
    console.error("[DELETE SERVICE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to delete service.", error: error?.message });
  }
});
