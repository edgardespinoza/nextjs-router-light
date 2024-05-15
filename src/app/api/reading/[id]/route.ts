import db from "@/db/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  let reading = await db.reading.findUnique({
    where: { id: id },
  });

  if (reading == null) {
    return NextResponse.json(
      {},
      {
        status: 404,
      }
    );
  }

  reading = await db.reading.delete({
    where: { id: id },
  });

  return NextResponse.json(reading);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  let reading = await db.reading.findUnique({
    where: { id: id },
  });

  if (reading == null) {
    return NextResponse.json(
      {},
      {
        status: 404,
      }
    );
  }
  return NextResponse.json(reading);
}

const readingSchema = z.object({
  roomId: z.string().uuid(),
  value: z.number().gte(0),
  month: z.number().gte(0).lte(13),
  year: z.number().gte(2000),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const requestValid = await request.json();

  const result = readingSchema.safeParse(requestValid);

  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  let reading = await db.reading.findUnique({
    where: { id: id },
  });

  if (reading == null) {
    return NextResponse.json(
      {},
      {
        status: 404,
      }
    );
  }

  const data = result.data;

  reading = await db.reading.update({
    where: {
      id: reading.id,
    },
    data: {
      value: data.value,
    },
  });

  return NextResponse.json(reading, { status: 201 });
}
