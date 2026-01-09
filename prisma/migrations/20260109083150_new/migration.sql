/*
  Warnings:

  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Position` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `room_id` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price_per_night` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_price` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Room` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'employee', 'user');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'banned');

-- CreateEnum
CREATE TYPE "PositionStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('deluxe', 'suite', 'presidential', 'standard');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_room_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_user_id_fkey";

-- DropIndex
DROP INDEX "Booking_user_id_room_id_status_idx";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "room_id" SET NOT NULL,
ALTER COLUMN "price_per_night" SET NOT NULL,
ALTER COLUMN "total_price" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "status",
ADD COLUMN     "status" "PositionStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "description" TEXT,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "RoomType" NOT NULL DEFAULT 'standard',
DROP COLUMN "status",
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "Booking_room_id_check_in_check_out_idx" ON "Booking"("room_id", "check_in", "check_out");

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- CreateIndex
CREATE INDEX "Position_name_status_idx" ON "Position"("name", "status");

-- CreateIndex
CREATE INDEX "Room_title_status_idx" ON "Room"("title", "status");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
