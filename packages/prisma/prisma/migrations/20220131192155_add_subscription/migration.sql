/*
  Warnings:

  - You are about to drop the column `subscriptionPlanId` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `SubscriptionPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - The `planType` column on the `SubscriptionPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `FigmaReadWritePair` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToOrganization` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[planType,active]` on the table `SubscriptionPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscriptionId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_subscriptionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "GithubInstallation" DROP CONSTRAINT "GithubInstallation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_organizationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserToOrganization" DROP CONSTRAINT "UserToOrganization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserToOrganization" DROP CONSTRAINT "UserToOrganization_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "subscriptionPlanId",
ADD COLUMN     "subscriptionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP CONSTRAINT "SubscriptionPlan_pkey",
DROP COLUMN "name",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "planType",
ADD COLUMN     "planType" "SubscriptionPlanType" NOT NULL DEFAULT E'HOBBY',
ADD CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "FigmaReadWritePair";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationPlan";

-- DropTable
DROP TABLE "UserToOrganization";

-- DropEnum
DROP TYPE "OrganizationPlanType";

-- DropEnum
DROP TYPE "OrganizationType";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL,
    "subscriptionPlanId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_planType_active_key" ON "SubscriptionPlan"("planType", "active");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
