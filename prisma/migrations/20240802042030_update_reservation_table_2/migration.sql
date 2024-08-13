/*
  Warnings:

  - The primary key for the `reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reservationId` on the `reservation` table. All the data in the column will be lost.
  - The required column `reserveId` was added to the `Reservation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `reservation` DROP PRIMARY KEY,
    DROP COLUMN `reservationId`,
    ADD COLUMN `reserveId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`reserveId`);
