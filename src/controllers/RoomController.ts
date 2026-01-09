import { RoomType } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const RoomController = {
  getRooms: async () => {
    try {
      const rooms = await prisma.room.findMany({
        select: {
          id: true,
          title: true,
          price: true,
          label: true,
          description: true,
          type: true,
          image: true,
          status: true,
        },
        where: {
          status: "active",
        },
        orderBy: {
          id: "asc",
        },
      });
      return { rooms: rooms };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  getRoomById: async ({ params }: { params: { id: string } }) => {
    try {
      const room = await prisma.room.findFirst({
        where: {
          id: Number(params.id),
          status: "active",
        },
        include: {
          bookings: {
            where: {
              status: { in: ["pending", "confirmed"] },
            },
            select: {
              check_in: true,
              check_out: true,
            },
            orderBy: {
              check_in: "asc",
            },
          },
        },
      });
      return { room };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  createRoom: async ({ request }: { request: Request }) => {
    try {
      const body = await request.json();
      if (!body.title || body.title.trim() === "") {
        return { error: "กรุณาระบุชื่อห้อง" };
      }

      if (!body.price) {
        return { error: "กรุณากรอกราคาห้อง" };
      }

      if (Number(body.price) <= 0) {
        return { error: "ราคาต้องมากกว่า 0" };
      }

      const price = Number(body.price);
      if (isNaN(price)) return { error: "ราคาห้องไม่ถูกต้อง" };

      const type = body.type as RoomType;
      if (!type) return { error: "กรุณาเลือกประเภทห้อง" };

      const room = await prisma.room.create({
        data: {
          title: body.title,
          price: price,
          label: body.label,
          description: body.description,
          type: type,
          image: body.image,
          status: "active",
        },
      });

      return { room };
    } catch (error) {
      console.error("CREATE ROOM ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  updateRoom: async ({
    request,
    params,
  }: {
    request: Request;
    params: { id: string };
  }) => {
    try {
      const body = await request.json();

      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid room id" };

      const old = await prisma.room.findUnique({ where: { id } });
      if (!old) return { error: "ไม่พบห้อง" };

      const price = Number(body.price);
      if (isNaN(price)) return { error: "ราคาห้องไม่ถูกต้อง" };

      const type = body.type as RoomType;
      if (!type) return { error: "กรุณาเลือกประเภทห้อง" };

      const room = await prisma.room.update({
        where: {
          id: id,
        },
        data: {
          title: body.title,
          price: price,
          label: body.label,
          description: body.description,
          type: type,
          image: body.image ?? old.image,
          status: body.status,
        },
      });

      return { room };
    } catch (error) {
      console.error("UPDATE ROOM ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  deleteRoom: async ({ params }: { params: { id: string } }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid room id" };

      const old = await prisma.room.findUnique({ where: { id } });
      if (!old) return { error: "ไม่พบห้อง" };

      const room = await prisma.room.update({
        where: {
          id: id,
        },
        data: {
          status: "inactive",
        },
      });

      return { room };
    } catch (error) {
      console.error("DELETE ROOM ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
