-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "figmaOauthConnectionId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_figmaOauthConnectionId_fkey" FOREIGN KEY ("figmaOauthConnectionId") REFERENCES "FigmaOauthConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
