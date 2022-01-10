-- CreateTable
CREATE TABLE "FigmaOauthConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,

    CONSTRAINT "FigmaOauthConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FigmaOauthConnection" ADD CONSTRAINT "FigmaOauthConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
