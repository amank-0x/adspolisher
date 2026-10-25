-- DropForeignKey
ALTER TABLE "DocumentReport" DROP CONSTRAINT "DocumentReport_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "DocumentReport" ADD CONSTRAINT "DocumentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
