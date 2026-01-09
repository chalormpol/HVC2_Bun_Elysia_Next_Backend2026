import { Elysia } from "elysia";
import { AuthController } from "../controllers/AuthController";

export const authRoutes = new Elysia()
  // ✅ Login user
  .post("/auth/signin", async ({ body }) => {
    const User = body as {
      email: string;
      password: string;
    };
    const user = await AuthController.signIn(User);
    return {
      status: "success",
      message: "User logged in successfully",
      User: user,
    };
  })

  // ✅ Sign up (create only, ไม่ update)
  .post("/auth/signup", async ({ body }) => {
    try {
      const neonUser = body as {
        email: string;
        password: string;
        fname?: string;
        lname?: string;
        phone?: string;
        image?: string;
      };
      console.log("Signup request:", neonUser);

      const user = await AuthController.signUp(neonUser);

      return {
        status: "success",
        message: "User created successfully",
        User: user,
      };
    } catch (err: any) {
      console.error("Signup error:", err);
      return { status: "error", message: err.message };
    }
  })

  // Refresh token
  .post("/auth/refresh-token", async ({ headers }) => {
    const authHeader = headers["authorization"] || headers["Authorization"];
    if (!authHeader) return { status: "error", message: "Unauthorized" };

    const token = authHeader.split(" ")[1]; // Bearer token
    if (!token) return { status: "error", message: "Unauthorized" };

    try {
      const newToken = await AuthController.refreshToken(token);
      return {
        status: "success",
        message: "Token refreshed successfully",
        token: newToken,
      };
    } catch (err: any) {
      return { status: "error", message: err.message };
    }
  });
