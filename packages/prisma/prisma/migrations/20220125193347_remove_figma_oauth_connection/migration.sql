/*
  Warnings:

  - You are about to drop the column `figmaOauthConnectionId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `FigmaOauthConnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FigmaOauthConnection" DROP CONSTRAINT "FigmaOauthConnection_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_figmaOauthConnectionId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "figmaOauthConnectionId";

-- DropTable
DROP TABLE "FigmaOauthConnection";
