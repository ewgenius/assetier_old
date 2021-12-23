-- CreateEnum
CREATE TYPE "GithubAccountType" AS ENUM ('USER', 'ORGANIZATION');

-- AlterTable
ALTER TABLE "GithubInstallation" ADD COLUMN     "accountAvatarUrl" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "accountLogin" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "accountType" "GithubAccountType" NOT NULL DEFAULT E'USER';
