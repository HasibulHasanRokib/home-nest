/*
  Warnings:

  - You are about to drop the column `mobileNumberVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "mobileNumberVerified";

-- AlterTable
ALTER TABLE "Validation" ADD COLUMN     "mobileNumberRemarks" TEXT,
ADD COLUMN     "mobileNumberVerified" BOOLEAN NOT NULL DEFAULT false;
