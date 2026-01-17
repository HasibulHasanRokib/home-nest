/*
  Warnings:

  - A unique constraint covering the columns `[propertyId]` on the table `Rental` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Rental_propertyId_key" ON "Rental"("propertyId");
