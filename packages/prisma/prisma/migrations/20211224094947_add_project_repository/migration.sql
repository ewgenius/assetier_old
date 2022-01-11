/*
  Warnings:

  - Added the required column `githubInstallationId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repositoryId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubInstallationId" TEXT NOT NULL,
ADD COLUMN     "repositoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_githubInstallationId_fkey" FOREIGN KEY ("githubInstallationId") REFERENCES "GithubInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
