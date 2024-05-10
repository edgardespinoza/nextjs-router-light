import db from "@/db/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  let room = await db.room.findUnique({
    where: { id: id },
  });

  if (room == null) {
    return NextResponse.json(
      {},
      {
        status: 400,
      }
    );
  }

  room = await db.room.delete({
    where: { id: id },
  });

  return NextResponse.json(room);
}
