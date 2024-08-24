/*
  Warnings:

  - Added the required column `seats` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `seats` INTEGER NOT NULL;
