-- DropForeignKey
ALTER TABLE `availability` DROP FOREIGN KEY `availability_ibfk_1`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_ibfk_2`;

-- DropForeignKey
ALTER TABLE `camping_spot_amenities` DROP FOREIGN KEY `camping_spot_amenities_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_ibfk_2`;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `camping_spot_amenities` ADD CONSTRAINT `camping_spot_amenities_ibfk_1` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`CampingSpot_ID`) REFERENCES `campingspot`(`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;
