import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export async function PUT(req, context) {
  try {
    const { classCode } = context.params;
    const body = await req.json();

    const last = await prisma.classes.findFirst({
      where: { classCode },
      orderBy: { id: "desc" }
    });

    if (!last) {
      return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 });
    }

    const version = last.version + 1;
    const previous_hash = last.current_hash;
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
        nonce: 0
      }
    });

    return new Response(JSON.stringify(newRow), { status: 201 });

  } catch (error) {
    console.error("❌ Error updating class:", error);
    return new Response(JSON.stringify({ error: "Failed to update class", message: error.message }), { status: 500 });
  }
}

export async function DELETE(_, context) {
  try {
    const { classCode } = context.params;

    const last = await prisma.classes.findFirst({
      where: { classCode },
      orderBy: { id: "desc" }
    });

    if (!last) {
      return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 });
    }

    const version = last.version + 1;
    const previous_hash = last.current_hash;
    const combined = `${last.classCode}${last.className}${last.teacherID}${last.date}${last.time}${previous_hash}${version}`;
    const current_hash = generateHash(combined);

    const deleted = await prisma.classes.create({
      data: {
        classCode: last.classCode,
        className: last.className,
        teacherID: last.teacherID,
        date: last.date,
        time: last.time,
        status: "DELETE",
        version,
        previous_hash,
        current_hash,
        nonce: 0
      }
    });

    return new Response(JSON.stringify({ message: "Deleted blockchain-style", deleted }), { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting class:", error);
    return new Response(JSON.stringify({ error: "Failed to delete class", message: error.message }), { status: 500 });
  }
}
