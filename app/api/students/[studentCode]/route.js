import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const { studentCode } = params;
    const data = await req.json();
    const updated = await prisma.students.update({
      where: { studentCode },
      data,
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({ error: "Failed to update student" }), {
      status: 500,
    });
  }
}

export async function DELETE(_, { params }) {
  try {
    const { studentCode } = params;
    await prisma.students.delete({
      where: { studentCode },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return new Response(JSON.stringify({ error: "Failed to delete student" }), {
      status: 500,
    });
  }
}
