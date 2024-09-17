/*
  Warnings:

  - Added the required column `district` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDistrict` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `district` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `subDistrict` VARCHAR(191) NOT NULL;
