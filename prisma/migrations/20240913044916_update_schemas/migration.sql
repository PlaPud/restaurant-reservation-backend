-- AlterTable
ALTER TABLE `customer` ADD COLUMN `profileImgPath` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `reservePrice` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `profileImgPath` VARCHAR(191) NOT NULL DEFAULT '';
