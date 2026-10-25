ALTER TABLE "DocumentReport"
    ADD COLUMN "tamperedProbability" DECIMAL(5,2),
    ADD COLUMN "tamperDecision" TEXT,
    ADD COLUMN "edgeResponse" DECIMAL(7,2),
    ADD COLUMN "noiseTexture" DECIMAL(7,2),
    ADD COLUMN "sharpness" DECIMAL(7,2);
