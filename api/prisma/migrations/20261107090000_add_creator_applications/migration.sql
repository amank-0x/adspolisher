-- CreateEnum
CREATE TYPE "CreatorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CreatorApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "portfolioUrl" TEXT NOT NULL,
    "secondaryUrl" TEXT,
    "craftSpecialty" TEXT NOT NULL,
    "primaryTools" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "weeklyAvailability" TEXT NOT NULL,
    "notes" TEXT,
    "fileSummaries" JSONB,
    "status" "CreatorApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorApplication_status_createdAt_idx" ON "CreatorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CreatorApplication_email_idx" ON "CreatorApplication"("email");

-- CreateIndex
CREATE INDEX "CreatorApplication_reviewedById_reviewedAt_idx" ON "CreatorApplication"("reviewedById", "reviewedAt");

-- AddForeignKey
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
