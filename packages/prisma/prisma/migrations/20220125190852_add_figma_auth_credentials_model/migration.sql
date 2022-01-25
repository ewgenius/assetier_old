-- CreateTable
CREATE TABLE "FigmaAuthCredentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "FigmaAuthCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FigmaAuthCredentials_userId_key" ON "FigmaAuthCredentials"("userId");

-- AddForeignKey
ALTER TABLE "FigmaAuthCredentials" ADD CONSTRAINT "FigmaAuthCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
