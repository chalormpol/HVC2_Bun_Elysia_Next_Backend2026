import { Elysia } from "elysia";
import { UserController } from "../controllers/UserController";

export const userRoutes = new Elysia()
  .get("/api/users/info/:id", async ({ params }) => {
    return UserController.getUserById({ params });
  })
  .get("/api/users/list", async () => {
    return UserController.getUsers();
  })
  .post("/api/users/create", async ({ request }) => {
    return UserController.createUser({ request });
  })
  .put("/api/users/updateUser/:id", async ({ request, params }) => {
    return UserController.updateUser({ request, params });
  })
  .put("/api/users/allow/:id", async ({ params }) => {
    return UserController.allowUser({ params });
  })
  .put("/api/users/remove/:id", async ({ params }) => {
    return UserController.deleteUser({ params });
  })
  .put("/api/users/banned/:id", async ({ params }) => {
    return UserController.bannedUser({ params });
  })
  .get("/api/users/level", async ({ request }) => {
    return UserController.level({ request });
  });
