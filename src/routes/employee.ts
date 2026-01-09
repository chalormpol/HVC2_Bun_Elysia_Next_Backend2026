import { Elysia } from "elysia";
import { EmployeeController } from "../controllers/EmployeeController";

export const employeeRoutes = new Elysia()
  .get("/api/employees/list", async () => {
    return EmployeeController.getEmployees();
  })
  .post("/api/employees/create", async ({ request }) => {
    return EmployeeController.createEmployee({ request });
  })
  .put("/api/employees/updateEmployee/:id", async ({ request, params }) => {
    return EmployeeController.updateEmployee({ request, params });
  })
  .put("/api/employees/allow/:id", async ({ params }) => {
    return EmployeeController.allowEmployee({ params });
  })
  .put("/api/employees/remove/:id", async ({ params }) => {
    return EmployeeController.deleteEmployee({ params });
  })
  .put("/api/employees/banned/:id", async ({ params }) => {
    return EmployeeController.bannedEmployee({ params });
  });
