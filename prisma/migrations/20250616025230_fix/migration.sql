/*
  Warnings:

  - Made the column `sourceUrl` on table `CreditCard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CreditCard" ALTER COLUMN "sourceUrl" SET NOT NULL;
