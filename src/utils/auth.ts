import jwt from "jsonwebtoken";

export const getUserFromToken = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    return decoded;
  } catch {
    return null;
  }
};
