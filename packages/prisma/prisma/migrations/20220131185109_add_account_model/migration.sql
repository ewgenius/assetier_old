/*
  Warnings:

  - Added the required column `accountId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PERSONAL', 'TEAM');

-- CreateEnum
CREATE TYPE "SubscriptionPlanType" AS ENUM ('HOBBY', 'PRO', 'TEAM_TRIAL');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserToAccount" (
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MEMBER',
    "isPersonal" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserToAccount_pkey" PRIMARY KEY ("userId","accountId")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT E'PERSONAL',
    "name" TEXT NOT NULL DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionPlanId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "name" TEXT NOT NULL,
    "planType" "OrganizationPlanType" NOT NULL DEFAULT E'HOBBY',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectsLimit" INTEGER NOT NULL DEFAULT 1,
    "usersLimit" INTEGER NOT NULL DEFAULT 1,
    "allowGithubPrivateRepos" BOOLEAN NOT NULL DEFAULT false,
    "allowGithubOrgs" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_planType_active_key" ON "SubscriptionPlan"("planType", "active");

-- AddForeignKey
ALTER TABLE "UserToAccount" ADD CONSTRAINT "UserToAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToAccount" ADD CONSTRAINT "UserToAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES "SubscriptionPlan"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
