import { Elysia } from "elysia";
import { PositionController } from "../controllers/PositionController";

export const positionRoutes = new Elysia()
  .get("/api/positions/list", async () => {
    return PositionController.getPositions();
  })
  .post("/api/positions/create", async ({ request }) => {
    return PositionController.createPosition({ request });
  })
  .put("/api/positions/update/:id", async ({ request, params }) => {
    return PositionController.updatePosition({ request, params });
  })
  .put("/api/positions/remove/:id", async ({ params }) => {
    return PositionController.deletePosition({ params });
  });
