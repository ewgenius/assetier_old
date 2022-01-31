/*
  Warnings:

  - Added the required column `accountId` to the `GithubInstallation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubInstallation" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GithubInstallation" ADD CONSTRAINT "GithubInstallation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
