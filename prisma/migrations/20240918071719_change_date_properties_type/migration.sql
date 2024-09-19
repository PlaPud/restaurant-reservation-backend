/*
  Warnings:

  - You are about to alter the column `reserveDate` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `lastModified` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `reservation` MODIFY `reserveDate` INTEGER NOT NULL,
    MODIFY `lastModified` INTEGER NULL;
