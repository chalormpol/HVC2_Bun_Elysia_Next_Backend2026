import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { employeeRoutes } from "./routes/employee";
import { adminRoutes } from "./routes/admin";
import { positionRoutes } from "./routes/position";
import { rooms } from "./routes/rooms";
import { books } from "./routes/Book";
import { contacts } from "./routes/contact";
import { jwt } from "@elysiajs/jwt";

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "1h",
    })
  )

  .use(authRoutes)
  .use(userRoutes)
  .use(employeeRoutes)
  .use(adminRoutes)
  .use(positionRoutes)
  .use(rooms)
  .use(books)
  .use(contacts)
  .get("/", () => "Hello Elysia") // homepage

  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
