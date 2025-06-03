import db from "@/db/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let room = await db.room.findUnique({
    where: { id: id },
  });

  if (room == null) {
    return NextResponse.json(
      {},
      {
        status: 404,
      }
    );
  }

  room = await db.room.delete({
    where: { id: id },
  });

  return NextResponse.json(room);
}
