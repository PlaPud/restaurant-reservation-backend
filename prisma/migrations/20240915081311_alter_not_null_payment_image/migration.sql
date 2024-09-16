/*
  Warnings:

  - Made the column `payImgUrl` on table `reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `reservation` MODIFY `payImgUrl` VARCHAR(191) NOT NULL DEFAULT '';
