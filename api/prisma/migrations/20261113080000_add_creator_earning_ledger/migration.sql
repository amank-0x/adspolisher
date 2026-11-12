CREATE TYPE "EarningType" AS ENUM ('PROJECT_PAYMENT', 'MILESTONE', 'BONUS', 'ADJUSTMENT', 'DEDUCTION');
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'APPROVED', 'IN_PAYOUT', 'PAID', 'ON_HOLD', 'CANCELLED');

CREATE TABLE "EarningEntry" (
  "id" TEXT NOT NULL,
  "creatorId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "offerId" TEXT,
  "type" "EarningType" NOT NULL DEFAULT 'PROJECT_PAYMENT',
  "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
  "label" TEXT,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "amount" DECIMAL(10,2) NOT NULL,
  "approvedAt" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "holdReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EarningEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EarningEntry_offerId_key" ON "EarningEntry"("offerId");
CREATE INDEX "EarningEntry_creatorId_status_idx" ON "EarningEntry"("creatorId", "status");
CREATE INDEX "EarningEntry_projectId_idx" ON "EarningEntry"("projectId");

ALTER TABLE "EarningEntry" ADD CONSTRAINT "EarningEntry_creatorId_fkey"
  FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EarningEntry" ADD CONSTRAINT "EarningEntry_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EarningEntry" ADD CONSTRAINT "EarningEntry_offerId_fkey"
  FOREIGN KEY ("offerId") REFERENCES "ProjectOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "EarningEntry" (
  "id", "creatorId", "projectId", "offerId", "type", "status", "currency", "amount", "createdAt", "updatedAt"
)
SELECT
  'earn_' || md5('earning:' || offer."id"),
  offer."creatorId",
  offer."projectId",
  offer."id",
  'PROJECT_PAYMENT'::"EarningType",
  'PENDING'::"EarningStatus",
  offer."currency",
  offer."acceptedAmount",
  COALESCE(offer."respondedAt", offer."createdAt"),
  CURRENT_TIMESTAMP
FROM "ProjectOffer" AS offer
WHERE offer."status" = 'ACCEPTED' AND offer."acceptedAmount" IS NOT NULL;
