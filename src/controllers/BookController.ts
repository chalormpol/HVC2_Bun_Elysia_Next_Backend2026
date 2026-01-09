import { prisma } from "../lib/prisma";
import { getUserFromToken } from "../utils/auth";

export const BookController = {
  getBooking: async () => {
    try {
      const bookings = await prisma.booking.findMany({
        select: {
          id: true,
          check_in: true,
          check_out: true,
          nights: true,
          price_per_night: true,
          total_price: true,
          status: true,
          created_at: true,
          user: {
            select: {
              id: true,
              email: true,
              fname: true,
              lname: true,
            },
          },
          room: {
            select: {
              id: true,
              title: true,
              price: true,
              image: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      });
      return { bookings: bookings };
    } catch (error) {
      console.error("GET BOOKING ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  createBooking: async ({ request }: { request: Request }) => {
    try {
      const body = await request.json();

      if (!body.room_id || !body.check_in || !body.check_out) {
        return { error: "Missing required fields" };
      }

      const checkIn = new Date(body.check_in);
      const checkOut = new Date(body.check_out);

      if (checkOut <= checkIn) {
        return { error: "Check-out must be after check-in" };
      }

      const diffMs = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const user = getUserFromToken(request);
      if (!user) {
        return { error: "Unauthorized" };
      }

      const room = await prisma.room.findUnique({
        where: { id: Number(body.room_id) },
      });

      if (!room || room.status !== "active" || room.price == null) {
        return { error: "Room not available" };
      }

      // ตรวจสอบว่าห้องนี้มีการจองอยู่หรือไม่
      const conflict = await prisma.booking.findFirst({
        where: {
          room_id: Number(body.room_id),
          status: { in: ["pending", "confirmed"] },
          check_in: { lt: checkOut },
          check_out: { gt: checkIn },
        },
      });

      if (conflict) {
        return {
          error: "Room is already booked for selected dates",
          conflict,
        };
      }

      const booking = await prisma.booking.create({
        data: {
          user_id: Number(user.id),
          room_id: Number(body.room_id),
          check_in: checkIn,
          check_out: checkOut,
          nights: nights,
          price_per_night: room.price,
          total_price: room.price * nights,
          status: "pending",
        },
      });
      return { booking: booking };
    } catch (error) {
      console.error("CREATE BOOKING ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  historyBooking: async ({ request }: { request: Request }) => {
    try {
      const user = getUserFromToken(request);
      if (!user) {
        return { error: "Unauthorized" };
      }
      const bookings = await prisma.booking.findMany({
        where: {
          user_id: Number(user.id),
        },
        include: {
          room: true,
        },
        orderBy: {
          id: "desc",
        },
      });
      return { bookings: bookings };
    } catch (error) {
      console.error("HISTORY BOOKING ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  updateStatusBooking: async ({
    request,
    params,
  }: {
    request: Request;
    params: { id: string };
  }) => {
    try {
      const body = await request.json();
      const booking = await prisma.booking.update({
        where: {
          id: Number(params.id),
        },
        data: {
          status: body.status,
        },
      });
      return { booking: booking };
    } catch (error) {
      console.error("UPDATE STATUS BOOKING ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
