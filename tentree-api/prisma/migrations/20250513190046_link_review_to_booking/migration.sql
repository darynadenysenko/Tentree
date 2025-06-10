/*
  Warnings:

  - A unique constraint covering the columns `[Booking_ID]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `Booking_ID` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `reviews_Booking_ID_key` ON `reviews`(`Booking_ID`);

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_Booking_ID_fkey` FOREIGN KEY (`Booking_ID`) REFERENCES `booking`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
