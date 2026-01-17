/*
  Warnings:

  - Added the required column `rating` to the `PropertyReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyReview" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;
