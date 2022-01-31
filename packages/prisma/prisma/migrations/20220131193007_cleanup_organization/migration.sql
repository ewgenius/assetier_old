/*
  Warnings:

  - You are about to drop the column `organizationId` on the `GithubInstallation` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GithubInstallation" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "organizationId";
