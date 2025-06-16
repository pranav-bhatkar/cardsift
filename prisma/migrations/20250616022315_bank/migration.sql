/*
  Warnings:

  - You are about to drop the column `bank` on the `CreditCard` table. All the data in the column will be lost.
  - Added the required column `bankId` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "bank",
ADD COLUMN     "bankId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_name_key" ON "bank"("name");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
