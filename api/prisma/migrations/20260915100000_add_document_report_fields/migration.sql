-- Store only the document and report fields consumed by the dashboard/report views.
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'PASSPORT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "DocumentReport"
    ADD COLUMN "reportReference" TEXT,
    ADD COLUMN "documentId" TEXT,
    ADD COLUMN "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    ADD COLUMN "overallRiskScore" DECIMAL(7,2),
    ADD COLUMN "verdict" TEXT,
    ADD COLUMN "riskLevel" TEXT,
    ADD COLUMN "fullName" TEXT,
    ADD COLUMN "dateOfBirth" TEXT,
    ADD COLUMN "identifier" TEXT,
    ADD COLUMN "mrzChecksumValid" BOOLEAN,
    ADD COLUMN "authenticityConfidence" DECIMAL(5,2),
    ADD COLUMN "elaVariance" DECIMAL(7,2),
    ADD COLUMN "fontConsistency" DECIMAL(5,2),
    ADD COLUMN "consentGranted" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "consentedAt" TIMESTAMP(3),
    ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "DocumentReport"
    ALTER COLUMN "reportReference" SET NOT NULL,
    ALTER COLUMN "documentId" SET NOT NULL;

ALTER TABLE "Document"
    ADD CONSTRAINT "Document_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentReport"
    ADD CONSTRAINT "DocumentReport_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "DocumentReport_reportReference_key" ON "DocumentReport"("reportReference");
CREATE INDEX "Document_userId_createdAt_idx" ON "Document"("userId", "createdAt");
CREATE INDEX "Document_documentType_idx" ON "Document"("documentType");
CREATE INDEX "DocumentReport_userId_createdAt_idx" ON "DocumentReport"("userId", "createdAt");
CREATE INDEX "DocumentReport_documentId_createdAt_idx" ON "DocumentReport"("documentId", "createdAt");
CREATE INDEX "DocumentReport_status_idx" ON "DocumentReport"("status");
