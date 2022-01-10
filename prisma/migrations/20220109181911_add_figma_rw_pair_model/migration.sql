-- CreateTable
CREATE TABLE "FigmaReadWritePair" (
    "readKey" TEXT NOT NULL,
    "writeKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "FigmaReadWritePair_readKey_key" ON "FigmaReadWritePair"("readKey");

-- CreateIndex
CREATE UNIQUE INDEX "FigmaReadWritePair_writeKey_key" ON "FigmaReadWritePair"("writeKey");
