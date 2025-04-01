import { PrismaClient } from '@prisma/client';
import crypto from "crypto";

const prisma = new PrismaClient();

// Hashing function
function generateHash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// ✅ PUT: Add new update row (blockchain-style)
export async function PUT(req, context) {
  try {
    const { classCode } = context.params;
    const body = await req.json();

    const lastClass = await prisma.classes.findFirst({
      orderBy: { id: "desc" },
    });

    const previous_hash = lastClass?.current_hash || null;
    const version = lastClass ? lastClass.version + 1 : 1;
    const combined = `${body.classCode}${body.className}${body.teacherID}${body.date}${body.time}${previous_hash}${version}`;
    const current_hash = generateHash(combined);

    const timeObj = new Date(`1970-01-01T${body.time}:00Z`);

    const newRow = await prisma.classes.create({
      data: {
        classCode: body.classCode,
        className: body.className,
        teacherID: parseInt(body.teacherID),
        date: new Date(body.date),
        time: timeObj,
        status: "UPDATE",
        version,
        previous_hash,
        current_hash,
        nonce: 0,
      },
    });

    return new Response(JSON.stringify(newRow), { status: 201 });

  } catch (error) {
    console.error("❌ Error creating update row:", error);
    return new Response(JSON.stringify({ error: "Failed to update class", message: error.message }), {
      status: 500,
    });
  }
}

// ✅ DELETE: Create a "DELETE" record instead of removing the row
export async function DELETE(_, context) {
  try {
    const { classCode } = context.params;

    // Get the latest row of that classCode
    const lastClass = await prisma.classes.findFirst({
      where: { classCode },
      orderBy: { id: "desc" },
    });

    if (!lastClass) {
      return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 });
    }

    const version = lastClass.version + 1;
    const previous_hash = lastClass.current_hash;
    const combined = `${lastClass.classCode}${lastClass.className}${lastClass.teacherID}${lastClass.date}${lastClass.time}${previous_hash}${version}`;
    const current_hash = generateHash(combined);

    const deleteRow = await prisma.classes.create({
      data: {
        classCode: lastClass.classCode,
        className: lastClass.className,
        teacherID: lastClass.teacherID,
        date: lastClass.date,
        time: lastClass.time,
        status: "DELETE",
        version,
        previous_hash,
        current_hash,
        nonce: 0,
      },
    });

    return new Response(JSON.stringify({ message: "Class deleted (soft delete blockchain-style)", data: deleteRow }), {
      status: 200,
    });

  } catch (error) {
    console.error("❌ Error deleting class:", error);
    return new Response(JSON.stringify({ error: "Failed to delete class", message: error.message }), {
      status: 500,
    });
  }
}
