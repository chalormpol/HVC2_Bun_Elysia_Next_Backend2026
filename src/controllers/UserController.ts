import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const UserController = {
  getUserById: async ({ params }: { params: { id: string } }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid user id" };

      const user = await prisma.user.findUnique({
        select: {
          role: true,
          email: true,
          fname: true,
          lname: true,
          phone: true,
          status: true,
          position: true,
        },
        where: { id: id },
      });
      return { user };
    } catch (error) {
      console.error("GET USER ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  getUsers: async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          role: true,
          phone: true,
          status: true,
          position: true,
        },
        where: {
          role: "user",
        },
        orderBy: {
          id: "asc",
        },
      });
      return { users: users };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { message: msg };
    }
  },
  createUser: async ({ request }: { request: Request }) => {
    try {
      const body = await request.json();

      if (!body.email || !body.password) {
        return { error: "Email และ Password จำเป็นต้องกรอก" };
      }

      const exists = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (exists) {
        return { error: "Email นี้ถูกใช้งานแล้ว" };
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          role: body.role,
          phone: body.phone,
          fname: body.fname,
          lname: body.lname,
          image: body.image ?? null,
          status: "active",
        },
      });

      return { user };
    } catch (error) {
      console.error("CREATE USER ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  updateUser: async ({
    request,
    params,
  }: {
    request: Request;
    params: { id: string };
  }) => {
    try {
      const body = await request.json();

      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid user id" };

      // 1. หา user เดิมก่อน
      const userOld = await prisma.user.findUnique({
        where: { id },
      });

      if (!userOld) {
        return { error: "ไม่พบผู้ใช้งาน" };
      }

      // 2. ตรวจว่ามีรหัสผ่านเดิมในระบบจริงไหม (กัน null)
      if (!userOld.password) {
        return { error: "บัญชีนี้ยังไม่มีรหัสผ่านในระบบ" };
      }

      // 3. ถ้ามีส่งรหัสผ่านเก่า ตรวจความถูกต้อง
      if (body.passwordOld) {
        const isMatch = await bcrypt.compare(
          body.passwordOld,
          userOld.password
        );
        if (!isMatch) {
          return { error: "รหัสผ่านเดิมไม่ถูกต้อง" };
        }
      }

      // 4. hash รหัสใหม่ถ้ามีส่งมา
      let hashPassword = userOld.password;
      if (body.password) {
        hashPassword = await bcrypt.hash(body.password, 10);
      }

      // 5. update ข้อมูล โดยใช้ข้อมูลใหม่ถ้ามี ส่งค่าเดิมถ้าไม่มี
      const user = await prisma.user.update({
        where: { id },
        data: {
          password: hashPassword,
          role: body.role ?? userOld.role,
          phone: body.phone ?? userOld.phone,
          fname: body.fname ?? userOld.fname,
          lname: body.lname ?? userOld.lname,
          image: body.image ?? userOld.image,
          status: body.status ?? userOld.status,
        },
      });

      return { user };
    } catch (error) {
      console.error("UPDATE USER ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  allowUser: async ({ params }: { params: { id: string } }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid user id" };

      const user = await prisma.user.update({
        where: { id },
        data: {
          status: "active",
        },
      });
      return { user };
    } catch (error) {
      console.error("ALLOW USER ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  deleteUser: async ({ params }: { params: { id: string } }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid user id" };

      const user = await prisma.user.update({
        where: { id },
        data: {
          status: "inactive",
        },
      });
      return { user };
    } catch (error) {
      console.error("DELETE USER ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  bannedUser: async ({ params }: { params: { id: string } }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) return { error: "Invalid user id" };

      const user = await prisma.user.update({
        where: { id },
        data: {
          status: "banned",
        },
      });
      return { user };
    } catch (error) {
      console.error("BAN USER ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  level: async ({ request }: { request: Request }) => {
    try {
      const auth = request.headers.get("authorization");

      if (!auth) {
        return { message: "Unauthorized" };
      }

      const token = auth.split(" ")[1];

      if (!token) {
        return { message: "Invalid token" };
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: Number(payload.id) },
        select: {
          id: true,
          role: true,
          email: true,
          fname: true,
          lname: true,
          image: true,
        },
      });

      return user;
    } catch (error) {
      console.error("LEVEL ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
