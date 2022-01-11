-- AlterTable
ALTER TABLE "OrganizationPlan" ADD COLUMN     "allowGithubOrgs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowGithubPrivateRepos" BOOLEAN NOT NULL DEFAULT false;
