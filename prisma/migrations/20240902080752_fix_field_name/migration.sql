/*
  Warnings:

  - You are about to drop the column `fname` on the `admin` table. All the data in the column will be lost.
  - Added the required column `fName` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `fname`,
    ADD COLUMN `fName` VARCHAR(191) NOT NULL;
