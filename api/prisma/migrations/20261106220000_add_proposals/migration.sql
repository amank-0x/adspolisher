-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "deliverables" JSONB,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "timeline" TEXT,
    "revisionLimit" INTEGER,
    "paymentTerms" TEXT,
    "expiresAt" TIMESTAMP(3),
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proposal_quoteRequestId_createdAt_idx" ON "Proposal"("quoteRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "Proposal_status_createdAt_idx" ON "Proposal"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Proposal_createdById_createdAt_idx" ON "Proposal"("createdById", "createdAt");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
