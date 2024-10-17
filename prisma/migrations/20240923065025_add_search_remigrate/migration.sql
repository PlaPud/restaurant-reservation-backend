-- CreateTable
CREATE TABLE `thai_amphures` (
    `id` INTEGER NOT NULL,
    `name_th` VARCHAR(150) NOT NULL,
    `name_en` VARCHAR(150) NOT NULL,
    `province_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thai_provinces` (
    `id` INTEGER NOT NULL,
    `name_th` VARCHAR(150) NOT NULL,
    `name_en` VARCHAR(150) NOT NULL,
    `geography_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thai_tambons` (
    `id` INTEGER NOT NULL,
    `zip_code` INTEGER NOT NULL,
    `name_th` VARCHAR(150) NOT NULL,
    `name_en` VARCHAR(150) NOT NULL,
    `amphure_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
