-- AlterTable
ALTER TABLE `reservation` MODIFY `customerId` VARCHAR(191) NULL,
    MODIFY `isAttended` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isPayed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `payImgUrl` VARCHAR(191) NULL,
    MODIFY `lastModified` VARCHAR(191) NULL;
