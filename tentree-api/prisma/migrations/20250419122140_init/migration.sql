-- CreateTable
CREATE TABLE `amenities` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `CampingSpot_ID` INTEGER NULL,
    `Date` DATE NULL,
    `IsAvailable` BOOLEAN NULL,

    INDEX `CampingSpot_ID`(`CampingSpot_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NULL,
    `CampingSpot_ID` INTEGER NULL,
    `StartDate` DATE NULL,
    `EndDate` DATE NULL,
    `Price` DECIMAL(10, 2) NULL,
    `Status_ID` INTEGER NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CampingSpot_ID`(`CampingSpot_ID`),
    INDEX `Status_ID`(`Status_ID`),
    INDEX `User_ID`(`User_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `camping_spot_amenities` (
    `CampingSpot_ID` INTEGER NOT NULL,
    `Amenity_ID` INTEGER NOT NULL,

    INDEX `Amenity_ID`(`Amenity_ID`),
    PRIMARY KEY (`CampingSpot_ID`, `Amenity_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campingspot` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Owner_ID` INTEGER NULL,
    `Name` VARCHAR(150) NULL,
    `Description` TEXT NULL,
    `Price` DECIMAL(10, 2) NULL,
    `MaxGuests` INTEGER NULL,
    `Street` VARCHAR(150) NULL,
    `City` INTEGER NULL,

    INDEX `City`(`City`),
    INDEX `Owner_ID`(`Owner_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `URL` VARCHAR(191) NOT NULL,
    `CampingSpotID` INTEGER NOT NULL,

    INDEX `camping_spot_photos`(`CampingSpotID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Country_ID` INTEGER NULL,

    INDEX `Country_ID`(`Country_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NULL,
    `CampingSpot_ID` INTEGER NULL,
    `Rating` INTEGER NULL,
    `Comment` TEXT NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CampingSpot_ID`(`CampingSpot_ID`),
    INDEX `User_ID`(`User_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(100) NULL,
    `LastName` VARCHAR(100) NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `IsAdmin` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`Status_ID`) REFERENCES `status`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `camping_spot_amenities` ADD CONSTRAINT `camping_spot_amenities_ibfk_1` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `camping_spot_amenities` ADD CONSTRAINT `camping_spot_amenities_ibfk_2` FOREIGN KEY (`Amenity_ID`) REFERENCES `amenities`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campingspot` ADD CONSTRAINT `campingspot_ibfk_1` FOREIGN KEY (`Owner_ID`) REFERENCES `user`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campingspot` ADD CONSTRAINT `campingspot_ibfk_2` FOREIGN KEY (`City`) REFERENCES `city`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `photo` ADD CONSTRAINT `photo_CampingSpotID_fkey` FOREIGN KEY (`CampingSpotID`) REFERENCES `campingspot`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`Country_ID`) REFERENCES `country`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
