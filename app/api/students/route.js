import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.students.findMany({
      select: {
        id: true,
        studentCode: true,
        firstName: true,
        lastName: true,
        sex: true,
        status: true,
      },
    });

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch students" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newStudent = await prisma.students.create({ data });
    return new Response(JSON.stringify(newStudent), { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return new Response(JSON.stringify({ error: "Failed to create student" }), {
      status: 500,
    });
  }
}
