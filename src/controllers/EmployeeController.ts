import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const EmployeeController = {
  getEmployees: async () => {
    try {
      const employees = await prisma.user.findMany({
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
          role: "employee",
        },
        orderBy: {
          id: "asc",
        },
      });
      return { employees: employees };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { message: msg };
    }
  },
  createEmployee: async ({ request }: { request: Request }) => {
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
      const employee = await prisma.user.create({
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

      return { employee };
    } catch (error) {
      console.error("CREATE EMPLOYEE ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  updateEmployee: async ({
    request,
    params,
  }: {
    request: Request;
    params: { id: string };
  }) => {
    try {
      const body = await request.json();

      // ✅ 1. หา user เดิมก่อน
      const employeeOld = await prisma.user.findUnique({
        where: { id: Number(params.id) },
      });

      if (!employeeOld) {
        return { error: "ไม่พบผู้ใช้งาน" };
      }

      // ✅ 2. ตรวจว่ามีรหัสผ่านเดิมในระบบจริงไหม (กัน null)
      if (!employeeOld.password) {
        return { error: "บัญชีนี้ยังไม่มีรหัสผ่านในระบบ" };
      }

      if (!body.passwordOld) {
        return { error: "กรุณากรอกรหัสผ่านเดิม" };
      }

      // ✅ 3. ตรวจรหัสผ่านเดิม
      const isMatch = await bcrypt.compare(
        body.passwordOld,
        employeeOld.password
      );

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
      const employee = await prisma.user.update({
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

      return { employee };
    } catch (error) {
      console.error("UPDATE EMPLOYEE ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  allowEmployee: async ({ params }: { params: { id: string } }) => {
    try {
      const employee = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          status: "active",
        },
      });
      return { employee };
    } catch (error) {
      console.error("ALLOW EMPLOYEE ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  deleteEmployee: async ({ params }: { params: { id: string } }) => {
    try {
      const employee = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          status: "inactive",
        },
      });
      return { employee };
    } catch (error) {
      console.error("DELETE EMPLOYEE ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  bannedEmployee: async ({ params }: { params: { id: string } }) => {
    try {
      const employee = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
          status: "banned",
        },
      });
      return { employee };
    } catch (error) {
      console.error("BAN EMPLOYEE ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
