import { prisma } from "../lib/prisma";

export const PositionController = {
  getPositions: async () => {
    try {
      const positions = await prisma.position.findMany({
        select: {
          id: true,
          name: true,
          status: true,
        },
        where: {
          status: "active",
        },
        orderBy: {
          id: "asc",
        },
      });
      return { positions: positions };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  createPosition: async ({ request }: { request: Request }) => {
    try {
      const body = await request.json();
      if (!body.name || body.name.trim() === "") {
        return { error: "กรุณาระบุชื่อตำแหน่ง" };
      }

      const exists = await prisma.position.findFirst({
        where: {
          name: body.name,
          status: "active",
        },
      });

      if (exists) {
        return { error: "ตำแหน่งนี้มีอยู่แล้ว" };
      }

      const position = await prisma.position.create({
        data: {
          name: body.name,
          status: "active",
        },
      });

      return { position };
    } catch (error) {
      console.error("CREATE POSITION ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  updatePosition: async ({
    request,
    params,
  }: {
    request: Request;
    params: { id: string };
  }) => {
    try {
      const body = await request.json();
      const old = await prisma.position.findUnique({
        where: { id: Number(params.id) },
      });

      if (!old) {
        return { error: "ไม่พบตำแหน่งงาน" };
      }

      const position = await prisma.position.update({
        where: {
          id: Number(params.id),
        },
        data: {
          name: body.name,
          status: body.status,
        },
      });

      return { position };
    } catch (error) {
      console.error("UPDATE POSITION ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  deletePosition: async ({ params }: { params: { id: string } }) => {
    try {
      const position = await prisma.position.update({
        where: {
          id: Number(params.id),
        },
        data: {
          status: "inactive",
        },
      });

      return { position };
    } catch (error) {
      console.error("DELETE POSITION ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
