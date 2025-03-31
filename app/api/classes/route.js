import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const classes = await prisma.classes.findMany({
      select: {
        id: true,
        classCode: true,
        className: true,
        teacherID: true,
        status: true,
      },
    });

    return new Response(JSON.stringify(classes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch classes" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newClass = await prisma.classes.create({ data });
    return new Response(JSON.stringify(newClass), { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return new Response(JSON.stringify({ error: "Failed to create class" }), {
      status: 500,
    });
  }
}
