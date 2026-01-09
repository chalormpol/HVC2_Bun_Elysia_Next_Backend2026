import { Elysia } from "elysia";
import { BookController } from "../controllers/BookController";

export const books = new Elysia()
  .get("/api/booking/list", async () => {
    return BookController.getBooking();
  })
  .post("/api/booking/create", async ({ request }) => {
    return BookController.createBooking({ request });
  })
  .get("/api/booking/history", async ({ request }) => {
    return BookController.historyBooking({ request });
  })
  .put("/api/booking/update-status/:id", async ({ request, params }) => {
    return BookController.updateStatusBooking({ request, params });
  });
