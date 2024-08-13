/*
  Warnings:

  - You are about to drop the column `reservations` on the `customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `reservations`;

-- CreateTable
CREATE TABLE `Restaurant` (
    `restaurantId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`restaurantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `reservationId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`reservationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_email_key` ON `Customer`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_phone_key` ON `Customer`(`phone`);

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`customerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`restaurantId`) ON DELETE RESTRICT ON UPDATE CASCADE;
