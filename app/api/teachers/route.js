import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const teachers = await prisma.teachers.findMany({
      select: {
        id: true,
        teacherCode: true,
        firstName: true,
        lastName: true,
        subject: true,
        experienceYears: true,
        status: true,
      },
    });

    return new Response(JSON.stringify(teachers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch teachers" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newTeacher = await prisma.teachers.create({ data });
    return new Response(JSON.stringify(newTeacher), { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return new Response(JSON.stringify({ error: "Failed to create teacher" }), {
      status: 500,
    });
  }
}
