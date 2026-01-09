import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const checkAdmin = async ({ request, set }: any) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    set.status = 401;
    return { message: "Unauthorized: No token provided" };
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    set.status = 401;
    return { message: "Unauthorized: Invalid token format" };
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string };
    if (payload.role !== "admin") {
      set.status = 403;
      return { message: "Forbidden: Admins only" };
    }
  } catch (err: any) {
    set.status = 401;
    if (err.message === "jwt expired") {
      return { message: "Token expired" };
    }
    return { message: "Invalid token" };
  }
};
