CREATE TYPE "ProjectOfferStatus" AS ENUM ('SENT', 'COUNTERED_BY_CREATOR', 'COUNTERED_BY_ADMIN', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'EXPIRED');
CREATE TYPE "OfferNegotiationAction" AS ENUM ('OFFER', 'COUNTER', 'ACCEPT', 'DECLINE', 'WITHDRAW');
CREATE TYPE "OfferNegotiationActor" AS ENUM ('ADMIN', 'CREATOR', 'SYSTEM');

CREATE TABLE "ProjectOffer" (
  "id" TEXT NOT NULL,
  "offerCode" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "creatorId" TEXT NOT NULL,
  "offeredById" TEXT NOT NULL,
  "roleTitle" TEXT NOT NULL DEFAULT 'Creator',
  "scopeSummary" TEXT NOT NULL,
  "paymentTerms" TEXT,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "currentAmount" DECIMAL(10,2) NOT NULL,
  "acceptedAmount" DECIMAL(10,2),
  "proposedDueDate" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "status" "ProjectOfferStatus" NOT NULL DEFAULT 'SENT',
  "currentRound" INTEGER NOT NULL DEFAULT 1,
  "maxRounds" INTEGER NOT NULL DEFAULT 3,
  "declineReason" TEXT,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "respondedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProjectOffer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OfferNegotiationEntry" (
  "id" TEXT NOT NULL,
  "offerId" TEXT NOT NULL,
  "round" INTEGER NOT NULL,
  "action" "OfferNegotiationAction" NOT NULL,
  "actorRole" "OfferNegotiationActor" NOT NULL,
  "actorId" TEXT,
  "amount" DECIMAL(10,2),
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OfferNegotiationEntry_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ProjectTeamMember" ADD COLUMN "offerId" TEXT;
CREATE UNIQUE INDEX "ProjectOffer_offerCode_key" ON "ProjectOffer"("offerCode");
CREATE UNIQUE INDEX "ProjectTeamMember_offerId_key" ON "ProjectTeamMember"("offerId");
CREATE INDEX "ProjectOffer_creatorId_status_idx" ON "ProjectOffer"("creatorId", "status");
CREATE INDEX "ProjectOffer_projectId_status_idx" ON "ProjectOffer"("projectId", "status");
CREATE INDEX "ProjectOffer_status_expiresAt_idx" ON "ProjectOffer"("status", "expiresAt");
CREATE INDEX "OfferNegotiationEntry_offerId_createdAt_idx" ON "OfferNegotiationEntry"("offerId", "createdAt");
ALTER TABLE "ProjectOffer" ADD CONSTRAINT "ProjectOffer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectOffer" ADD CONSTRAINT "ProjectOffer_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectOffer" ADD CONSTRAINT "ProjectOffer_offeredById_fkey" FOREIGN KEY ("offeredById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OfferNegotiationEntry" ADD CONSTRAINT "OfferNegotiationEntry_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "ProjectOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferNegotiationEntry" ADD CONSTRAINT "OfferNegotiationEntry_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "ProjectOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
