-- CreateTable
CREATE TABLE `passwordresettoken` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NOT NULL,
    `Token` VARCHAR(191) NOT NULL,
    `ExpiresAt` DATETIME(3) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `passwordresettoken_Token_key`(`Token`),
    INDEX `passwordresettoken_User_ID_idx`(`User_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `passwordresettoken` ADD CONSTRAINT `passwordresettoken_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `user`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
