// app/api/classes/route.js (GET, POST)
import { PrismaClient } from '@prisma/client';
import crypto from "crypto";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const classes = await prisma.classes.findMany({
      select: {
        id: true,
        classCode: true,
        className: true,
        teacherID: true,
        room: true,
        schedule: true,
        status: true,
        version: true,
        previous_hash: true,
        current_hash: true,
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

function generateHash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(req) {
  try {
    const body = await req.json();

    const lastClass = await prisma.classes.findFirst({
      orderBy: { id: "desc" },
    });

    const previous_hash = lastClass?.current_hash || null;
    const version = lastClass ? lastClass.version + 1 : 1;

    const combinedData = `${body.classCode}${body.className}${body.teacherID}${body.room}${body.schedule}${previous_hash}${version}`;
    const current_hash = generateHash(combinedData);

    const newClass = await prisma.classes.create({
      data: {
        classCode: body.classCode,
        className: body.className,
        teacherID: parseInt(body.teacherID),
        room: body.room,
        schedule: body.schedule,
        status: "INSERT",
        version,
        previous_hash,
        current_hash,
        nonce: 0,
      },
    });

    return new Response(JSON.stringify(newClass), { status: 201 });

  } catch (error) {
    console.error("❌ Error creating class:", error);
    return new Response(JSON.stringify({ error: "Failed to create class" }), {
      status: 500,
    });
  }
}
