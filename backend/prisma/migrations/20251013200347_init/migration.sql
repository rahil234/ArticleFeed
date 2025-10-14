/*
  Warnings:

  - The values [COMMENT,VIEW,SHARE] on the enum `InteractionType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId,articleId,type]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InteractionType_new" AS ENUM ('LIKE', 'DISLIKE', 'BLOCK');
ALTER TABLE "Interaction" ALTER COLUMN "type" TYPE "InteractionType_new" USING ("type"::text::"InteractionType_new");
ALTER TYPE "InteractionType" RENAME TO "InteractionType_old";
ALTER TYPE "InteractionType_new" RENAME TO "InteractionType";
DROP TYPE "public"."InteractionType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_userId_articleId_type_key" ON "Interaction"("userId", "articleId", "type");
