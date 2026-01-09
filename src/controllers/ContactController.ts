import { prisma } from "../lib/prisma";

export const ContactController = {
  getContacts: async () => {
    try {
      const contacts = await prisma.contact.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          id: "asc",
        },
      });
      return { contacts: contacts };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { message: msg };
    }
  },
  createContact: async ({ request }: { request: Request }) => {
    try {
      const body = await request.json();
      if (!body.email || !body.name || !body.message) {
        return { error: "Email, Name และ Message จำเป็นต้องกรอก" };
      }

      const contact = await prisma.contact.create({
        data: {
          email: body.email,
          name: body.name,
          message: body.message,
        },
      });

      return { contact };
    } catch (error) {
      console.error("CREATE CONTACT ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
  deleteContact: async ({ params }: { params: { id: string } }) => {
    try {
      const id = Number(params.id);
      const contact = await prisma.contact.delete({
        where: { id },
      });
      return { contact };
    } catch (error) {
      console.error("DELETE CONTACT ERROR =>", error);
      const msg = error instanceof Error ? error.message : String(error);
      return { error: msg };
    }
  },
};
