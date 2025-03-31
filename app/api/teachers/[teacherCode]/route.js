import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const { teacherCode } = params;
    const data = await req.json();

    const updated = await prisma.teachers.update({
      where: { teacherCode },
      data,
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return new Response(JSON.stringify({ error: "Failed to update teacher" }), { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const { teacherCode } = params;

    await prisma.teachers.delete({
      where: { teacherCode },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return new Response(JSON.stringify({ error: "Failed to delete teacher" }), { status: 500 });
  }
}
