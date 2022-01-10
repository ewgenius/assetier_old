/*
  Warnings:

  - Added the required column `organizationPlanId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationPlanType" AS ENUM ('HOBBY', 'PRO');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "organizationPlanId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrganizationPlan" (
    "name" TEXT NOT NULL,
    "planType" "OrganizationPlanType" NOT NULL DEFAULT E'HOBBY',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectsLimit" INTEGER NOT NULL DEFAULT 1,
    "usersLimit" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrganizationPlan_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationPlan_planType_active_key" ON "OrganizationPlan"("planType", "active");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_organizationPlanId_fkey" FOREIGN KEY ("organizationPlanId") REFERENCES "OrganizationPlan"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
