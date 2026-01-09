import { Elysia } from "elysia";
import { checkAdmin } from "../middleware/checkAdmin";
import { AdminController } from "../controllers/AdminController";

export const adminRoutes = new Elysia()
  .get(
    "/auth/admin-only",
    async () => {
      return { message: "Welcome, Admin!" };
    },
    { beforeHandle: checkAdmin }
  )
  .get("/api/admins/list", async () => {
    return AdminController.getAdmins();
  })
  .post("/api/admins/create", async ({ request }) => {
    return AdminController.createAdmin({ request });
  })
  .put("/api/admins/updateAdmin/:id", async ({ request, params }) => {
    return AdminController.updateAdmin({ request, params });
  })
  .put("/api/admins/allow/:id", async ({ params }) => {
    return AdminController.allowAdmin({ params });
  })
  .put("/api/admins/remove/:id", async ({ params }) => {
    return AdminController.deleteAdmin({ params });
  })
  .put("/api/admins/banned/:id", async ({ params }) => {
    return AdminController.bannedAdmin({ params });
  });
