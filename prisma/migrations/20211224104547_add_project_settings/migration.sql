-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "assetsPath" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "defaultBranch" TEXT NOT NULL DEFAULT E'main';
