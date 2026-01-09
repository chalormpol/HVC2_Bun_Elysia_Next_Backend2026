import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const AdminController = {
  getAdmins: async () => {
    try {
      const admins = await prisma.user.findMany({
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
          role: "admin",
        },
        orderBy: {
          id: "asc",
        },
      });
      return { admins: admins };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { message: msg };
    }
  },
  createAdmin: async ({ request }: { request: Request }) => {
    try {
      const body = await request.json();

      const exists = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (exists) {
        return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const admin = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          role: body.role,
          phone: body.phone,
          fname: body.fname,
          lname: body.lname,
          image: body.image ?? null,
          status: "active",
          position_id: body.positionId,
        },
      });

      return { admin };
    } catch (error) {
      console.error("CREATE ADMIN ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  updateAdmin: async ({
    request,
    params,
  }: {
    request: Request;
    params: { id: string };
  }) => {
    try {
      const body = await request.json();

      // ✅ 1. หา user เดิมก่อน
      const adminOld = await prisma.user.findUnique({
        where: { id: Number(params.id) },
      });

      if (!adminOld) {
        return { error: "ไม่พบผู้ใช้งาน" };
      }

      // ✅ 2. ตรวจว่ามีรหัสผ่านเดิมในระบบจริงไหม (กัน null)
      if (!adminOld.password) {
        return { error: "บัญชีนี้ยังไม่มีรหัสผ่านในระบบ" };
      }

      if (!body.passwordOld) {
        return { error: "กรุณากรอกรหัสผ่านเดิม" };
      }

      // ✅ 3. ตรวจรหัสผ่านเดิม
      const isMatch = await bcrypt.compare(body.passwordOld, adminOld.password);

      if (!isMatch) {
        return { error: "รหัสผ่านเดิมไม่ถูกต้อง" };
      }

      // ✅ 4. เช็ครหัสผ่านใหม่
      if (!body.password) {
        return { error: "กรุณากรอกรหัสผ่านใหม่" };
      }

      // ✅ 5. hash รหัสใหม่
      const hashPassword = await bcrypt.hash(body.password, 10);

      // ✅ 6. update ข้อมูล
      const admin = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          password: hashPassword,
          role: body.role,
          phone: body.phone,
          fname: body.fname,
          lname: body.lname,
          image: body.image ?? null,
          status: "active",
          position_id: body.positionId,
        },
      });

      return { admin };
    } catch (error) {
      console.error("UPDATE ADMIN ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  allowAdmin: async ({ params }: { params: { id: string } }) => {
    try {
      const admin = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          status: "active",
        },
      });
      return { admin };
    } catch (error) {
      console.error("ALLOW ADMIN ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  deleteAdmin: async ({ params }: { params: { id: string } }) => {
    try {
      const admin = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          status: "inactive",
        },
      });
      return { admin };
    } catch (error) {
      console.error("DELETE ADMIN ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  bannedAdmin: async ({ params }: { params: { id: string } }) => {
    try {
      const admin = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          status: "banned",
        },
      });
      return { admin };
    } catch (error) {
      console.error("BAN ADMIN ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
