import { Elysia } from "elysia";
import { ContactController } from "../controllers/ContactController";

export const contacts = new Elysia()
  .get("/api/contacts/list", async () => {
    return ContactController.getContacts();
  })
  .post("/api/contacts/create", async ({ request }) => {
    return ContactController.createContact({ request });
  })
  .delete("/api/contacts/remove/:id", async ({ params }) => {
    return ContactController.deleteContact({ params });
  });
