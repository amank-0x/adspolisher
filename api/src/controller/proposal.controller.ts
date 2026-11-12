import { type Request, type Response  } from "express";
import { z } from "zod";
import prismaClient, { withDatabaseRetry } from "../config/db.js";
import { sendProposalEmail } from "../utils/sendProposalEmail.js";

const proposalStatus = z.enum([
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
  "WITHDRAWN",
]);

const proposalInputSchema = z.object({
  quoteRequestId: z.string().trim().min(1, "A quote request is required"),
  title: z.string().trim().min(1, "A proposal title is required").max(160),
  summary: z.string().trim().min(1, "A proposal summary is required").max(5000),
  deliverables: z.array(z.string().trim().min(1).max(240)).max(30).default([]),
  price: z.number().positive("Price must be greater than zero"),
  currency: z.string().trim().length(3).toUpperCase().default("USD"),
  timeline: z.string().trim().max(240).optional().nullable(),
  revisionLimit: z.number().int().nonnegative().max(99).optional().nullable(),
  paymentTerms: z.string().trim().max(2000).optional().nullable(),
  expiresAt: z.string().datetime({ offset: true }).optional().nullable(),
});

const proposalUpdateSchema = proposalInputSchema.omit({ quoteRequestId: true }).partial();

function serializeProposal<T extends { price: { toString(): string } }>(proposal: T) {
  return { ...proposal, price: proposal.price.toString() };
}

function proposalUrl(requestId: string) {
  const baseUrl = (
    process.env.NEXT_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${baseUrl}/dashboard/requests/${requestId}`;
}

// GET /api/v1/admin/proposals?requestId=...

// POST /api/v1/admin/proposals

// PATCH /api/v1/admin/proposals/:id

// POST /api/v1/admin/proposals/:id/send

export const getRoot = async (req: Request, res: Response) => {
  try {
    const requestId = typeof req.query.requestId === "string" ? req.query.requestId : undefined;
    const proposals = await withDatabaseRetry(() =>
      prismaClient.proposal.findMany({
        ...(requestId ? { where: { quoteRequestId: requestId } } : {}),
        orderBy: { createdAt: "desc" },
        include: {
          quoteRequest: {
            select: { id: true, name: true, email: true, companyName: true },
          },
        },
      }),
    );

    return res.json({ success: true, data: proposals.map(serializeProposal) });
  } catch (error) {
    console.error("[ADMIN PROPOSALS GET ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to load proposals." });
  }
};

export const postRoot = async (req: Request, res: Response) => {
  const parsed = proposalInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Please check the proposal fields.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const request = await prismaClient.quoteRequest.findUnique({
      where: { id: parsed.data.quoteRequestId },
      select: { id: true, name: true, email: true, status: true },
    });
    if (!request) return res.status(404).json({ success: false, message: "Quote request not found." });

    const proposal = await withDatabaseRetry(() =>
      prismaClient.proposal.create({
        data: {
          quoteRequestId: parsed.data.quoteRequestId,
          createdById: String(res.locals.adminUserId),
          title: parsed.data.title,
          summary: parsed.data.summary,
          deliverables: parsed.data.deliverables,
          price: parsed.data.price,
          currency: parsed.data.currency,
          timeline: parsed.data.timeline ?? null,
          revisionLimit: parsed.data.revisionLimit ?? null,
          paymentTerms: parsed.data.paymentTerms ?? null,
          expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        },
      }),
    );

    await prismaClient.auditLog.create({
      data: {
        actorId: String(res.locals.adminUserId),
        action: "PROPOSAL_CREATED",
        targetType: "Proposal",
        targetId: proposal.id,
        metadata: { quoteRequestId: request.id },
      },
    });

    return res.status(201).json({ success: true, data: serializeProposal(proposal) });
  } catch (error) {
    console.error("[ADMIN PROPOSAL CREATE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to create proposal." });
  }
};

export const patchById = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = proposalUpdateSchema.safeParse(req.body);
  if (!id || !parsed.success) {
    return res.status(400).json({ success: false, message: "Please check the proposal fields." });
  }

  try {
    const existing = await prismaClient.proposal.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Proposal not found." });
    if (["ACCEPTED", "DECLINED", "WITHDRAWN"].includes(existing.status)) {
      return res.status(409).json({ success: false, message: "This proposal can no longer be edited." });
    }

    const data = parsed.data;
    const updated = await prismaClient.proposal.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.summary !== undefined ? { summary: data.summary } : {}),
        ...(data.deliverables !== undefined ? { deliverables: data.deliverables } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.timeline !== undefined ? { timeline: data.timeline } : {}),
        ...(data.revisionLimit !== undefined ? { revisionLimit: data.revisionLimit } : {}),
        ...(data.paymentTerms !== undefined ? { paymentTerms: data.paymentTerms } : {}),
        ...(data.expiresAt !== undefined
          ? { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }
          : {}),
        ...(existing.status === "SENT" || existing.status === "VIEWED"
          ? { status: "DRAFT", sentAt: null }
          : {}),
      },
    });

    return res.json({ success: true, data: serializeProposal(updated) });
  } catch (error) {
    console.error("[ADMIN PROPOSAL UPDATE ERROR]", error);
    return res.status(500).json({ success: false, message: "Failed to update proposal." });
  }
};

export const postByIdsend = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ success: false, message: "Proposal ID is required." });

  try {
    const proposal = await prismaClient.proposal.findUnique({
      where: { id },
      include: {
        quoteRequest: { select: { id: true, name: true, email: true, status: true } },
      },
    });
    if (!proposal) return res.status(404).json({ success: false, message: "Proposal not found." });
    if (["ACCEPTED", "DECLINED", "WITHDRAWN"].includes(proposal.status)) {
      return res.status(409).json({ success: false, message: "This proposal can no longer be sent." });
    }

    const deliverables = Array.isArray(proposal.deliverables)
      ? proposal.deliverables.filter((item): item is string => typeof item === "string")
      : [];

    await sendProposalEmail(proposal.quoteRequest.email, {
      clientName: proposal.quoteRequest.name,
      title: proposal.title,
      summary: proposal.summary,
      deliverables,
      price: proposal.price.toString(),
      currency: proposal.currency,
      timeline: proposal.timeline,
      revisionLimit: proposal.revisionLimit,
      paymentTerms: proposal.paymentTerms,
      expiresAt: proposal.expiresAt,
      proposalUrl: proposalUrl(proposal.quoteRequest.id),
    });

    const now = new Date();
    const [updated] = await prismaClient.$transaction([
      prismaClient.proposal.update({
        where: { id },
        data: { status: "SENT", sentAt: now },
      }),
      prismaClient.quoteRequest.update({
        where: { id: proposal.quoteRequest.id },
        data: proposal.quoteRequest.status === "NEW" ? { status: "IN_REVIEW" } : {},
      }),
      prismaClient.auditLog.create({
        data: {
          actorId: String(res.locals.adminUserId),
          action: "PROPOSAL_SENT",
          targetType: "Proposal",
          targetId: id,
          metadata: { recipient: proposal.quoteRequest.email },
        },
      }),
    ]);

    return res.json({ success: true, message: "Proposal email sent.", data: serializeProposal(updated) });
  } catch (error) {
    console.error("[ADMIN PROPOSAL SEND ERROR]", error);
    return res.status(502).json({ success: false, message: "The proposal could not be sent. Check email configuration and try again." });
  }
};
