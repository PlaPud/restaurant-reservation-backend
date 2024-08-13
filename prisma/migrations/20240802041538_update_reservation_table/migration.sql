/*
  Warnings:

  - Added the required column `date` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAttended` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPayed` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payImgUrl` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reserveDate` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAttended` BOOLEAN NOT NULL,
    ADD COLUMN `isPayed` BOOLEAN NOT NULL,
    ADD COLUMN `payImgUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `reserveDate` VARCHAR(191) NOT NULL;
