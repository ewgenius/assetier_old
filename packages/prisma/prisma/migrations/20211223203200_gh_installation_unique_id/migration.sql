/*
  Warnings:

  - A unique constraint covering the columns `[installationId]` on the table `GithubInstallation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GithubInstallation_installationId_key" ON "GithubInstallation"("installationId");
