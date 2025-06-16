/*
  Warnings:

  - A unique constraint covering the columns `[sourceUrl]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "sourceUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_sourceUrl_key" ON "CreditCard"("sourceUrl");
