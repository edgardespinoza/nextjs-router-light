import db from "@/db/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().length(5),
});

export const GET = async () => {
  const rooms = await db.room.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return NextResponse.json(rooms);
};

export async function POST(request: Request) {
  const requestValid = await request.json();

  const result = roomSchema.safeParse(requestValid);

  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  const data = result.data;

  const room = await db.room.create({
    data: { name: data.name },
  });

  return NextResponse.json(room, { status: 201 });
}
