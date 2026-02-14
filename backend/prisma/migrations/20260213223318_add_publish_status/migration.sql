-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT';
