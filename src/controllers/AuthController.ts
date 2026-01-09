import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const AuthController = {
  // Login
  signIn: async (neonUser: { email: string; password: string }) => {
    try {
      // หา user ตาม email
      const user = await prisma.user.findUnique({
        where: { email: neonUser.email },
      });
      if (!user || !user.password) {
        return { error: "User not found" };
      }

      const isValid = await bcrypt.compare(neonUser.password, user.password);
      if (!isValid) {
        return { error: "Incorrect password" };
      }

      // สร้าง JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          role: user.role,
        },
      };
    } catch (error) {
      console.error(error);
      return { error: "Cannot sign in" };
    }
  },

  // Sign up (create only, error ถ้ามีอยู่แล้ว)
  signUp: async (neonUser: {
    email: string;
    password: string;
    fname?: string;
    lname?: string;
    phone?: string;
    image?: string;
  }) => {
    try {
      // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
      const existingUser = await prisma.user.findUnique({
        where: { email: neonUser.email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password ก่อนเก็บ
      const hashedPassword = await bcrypt.hash(neonUser.password, 10);

      const user = await prisma.user.create({
        data: {
          email: neonUser.email,
          password: hashedPassword,
          fname: neonUser.fname,
          lname: neonUser.lname,
          phone: neonUser.phone,
          image: neonUser.image,
        },
      });

      return {
        user: {
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error(error);
      return { error: "Cannot create user" };
    }
  },

  // Refresh JWT
  refreshToken: async (token: string) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: number };

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) throw new Error("User not found");

      const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      return newToken;
    } catch {
      throw new Error("Invalid or expired token");
    }
  },
};
