import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export async function GET() {
  try {
    // Fetch all class entries, ordered newest to oldest
    const all = await prisma.classes.findMany({
      orderBy: { id: "desc" }
    });

    const seen = new Set();
    const latest = [];

    for (const cls of all) {
      if (!seen.has(cls.classCode)) {
        seen.add(cls.classCode);
        if (cls.status !== "DELETE") {
          latest.push(cls);
        }
      }
    }

    return new Response(JSON.stringify(latest), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error fetching classes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch classes" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Time Value:", body.time); // 🔍 Debug log

    const lastClass = await prisma.classes.findFirst({
      orderBy: { id: "desc" },
    });

    const version = lastClass ? lastClass.version + 1 : 1;
    const previous_hash = lastClass?.current_hash || null;

    const combined = `${body.classCode}${body.className}${body.teacherID}${body.date}${body.time}${previous_hash}${version}`;
    const current_hash = generateHash(combined);

    // ✅ Validate and parse time
    let timeString = body.time?.trim(); // Remove whitespace

    // Fallback if invalid or missing
    if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) {
      console.warn("⚠️ Invalid or missing time, defaulting to 00:00");
      timeString = "00:00";
    }

    const timeObj = new Date(`1970-01-01T${timeString}:00Z`);

    if (isNaN(timeObj.getTime())) {
      throw new Error("Invalid time format after fallback");
    }

    const newClass = await prisma.classes.create({
      data: {
        classCode: body.classCode,
        className: body.className,
        teacherID: parseInt(body.teacherID),
        date: new Date(body.date),
        time: timeObj,
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

