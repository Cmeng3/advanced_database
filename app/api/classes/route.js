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




function generateHash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(req) {
  try {
    const data = await req.json();

    const lastClass = await prisma.classes.findFirst({
      orderBy: { id: "desc" },
    });

    const version = lastClass ? lastClass.version + 1 : 1;
    const previous_hash = lastClass?.current_hash || null;

    const combined = `${data.classCode}${data.className}${data.teacherID}${version}${previous_hash}`;
    const current_hash = generateHash(combined);

    const newClass = await prisma.classes.create({
      data: {
        classCode: data.classCode,
        className: data.className,
        teacherID: parseInt(data.teacherID),
        studentIDs: data.studentIDs || null,
        date: new Date(data.date),   // ✅ expects ISO date string
        time: new Date(data.time),   // ✅ expects ISO time string or time as date
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
    return new Response(JSON.stringify({ error: "Failed to create class", message: error.message }), {
      status: 500,
    });
  }
}
