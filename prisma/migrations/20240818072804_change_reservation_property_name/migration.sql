/*
  Warnings:

  - You are about to drop the column `date` on the `reservation` table. All the data in the column will be lost.
  - Added the required column `lastModified` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `date`,
    ADD COLUMN `lastModified` VARCHAR(191) NOT NULL;
