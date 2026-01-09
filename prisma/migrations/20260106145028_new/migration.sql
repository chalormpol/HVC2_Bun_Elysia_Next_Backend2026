-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "room_id" INTEGER,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "price_per_night" INTEGER,
    "total_price" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_user_id_room_id_status_idx" ON "Booking"("user_id", "room_id", "status");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
