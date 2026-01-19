import { Elysia } from "elysia";
import { RoomController } from "../controllers/RoomController";

export const rooms = new Elysia()
  .get("/api/rooms/list", async () => {
    return RoomController.getRooms();
  })
  .get("/api/rooms/:id", async ({ params }) => {
    return RoomController.getRoomById({ params });
  })
  .post("/api/rooms/create", async ({ request }) => {
    return RoomController.createRoom({ request });
  })
  .put("/api/rooms/update/:id", async ({ request, params }) => {
    return RoomController.updateRoom({ request, params });
  })
  .put("/api/rooms/allow/:id", async ({ params }) => {
    return RoomController.allowRoom({ params });
  })
  .put("/api/rooms/banned/:id", async ({ params }) => {
    return RoomController.bannedRoom({ params });
  })
  .put("/api/rooms/remove/:id", async ({ params }) => {
    return RoomController.deleteRoom({ params });
  })
  .put("/api/rooms/cleaned/:id", async ({ params }) => {
    return RoomController.cleanedRoom({ params });
  });
