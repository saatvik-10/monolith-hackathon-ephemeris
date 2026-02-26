/*
  Warnings:

  - A unique constraint covering the columns `[contentHash]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "nftEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nftPayer" TEXT NOT NULL DEFAULT 'organizer',
ADD COLUMN     "organizerWallet" TEXT;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "contentHash" TEXT,
ADD COLUMN     "metadataUri" TEXT,
ADD COLUMN     "mintAddress" TEXT,
ADD COLUMN     "mintedAt" TIMESTAMP(3),
ADD COLUMN     "nftError" TEXT,
ADD COLUMN     "nftMinted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "walletAddress" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_contentHash_key" ON "Receipt"("contentHash");

-- CreateIndex
CREATE INDEX "Receipt_walletAddress_idx" ON "Receipt"("walletAddress");

-- CreateIndex
CREATE INDEX "Receipt_mintAddress_idx" ON "Receipt"("mintAddress");
