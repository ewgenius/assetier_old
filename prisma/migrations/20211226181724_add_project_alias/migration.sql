/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "alias" TEXT,
ADD COLUMN     "publicPageEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Project_alias_key" ON "Project"("alias");
