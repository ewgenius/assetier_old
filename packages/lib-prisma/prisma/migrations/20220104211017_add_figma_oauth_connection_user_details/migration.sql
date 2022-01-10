/*
  Warnings:

  - Added the required column `userEmail` to the `FigmaOauthConnection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userHandle` to the `FigmaOauthConnection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `FigmaOauthConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FigmaOauthConnection" ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD COLUMN     "userHandle" TEXT NOT NULL,
ADD COLUMN     "userImage" TEXT NOT NULL;
