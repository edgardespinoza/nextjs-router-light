import { findReadingByRoom } from "@/app/service/reading/getReading";
import db from "@/db/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { toReadingDto } from "../type";

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

    include: {
      room: true,
    },
  });

  if (reading == null) {
    return NextResponse.json(
      {},
      {
        status: 404,
      }
    );
  }

  let monthPrevious = reading.month - 1;
  let yearPrevious = reading.year;
  if (monthPrevious <= 0) {
    monthPrevious = 12;
    yearPrevious = yearPrevious - 1;
  }

  let readingsPrevious = await findReadingByRoom(
    monthPrevious,
    yearPrevious,
    reading.roomId
  );

  const result = toReadingDto(reading, readingsPrevious);

  return NextResponse.json(result);
}

const readingSchema = z.object({
  roomId: z.string().uuid(),
  meterWater: z.number().gte(0),
  meterLight: z.number().gte(0),
  rent: z.number().gte(0),
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
      meterWater: data.meterWater,
      meterLight: data.meterLight,
      rent: data.rent,
    },
  });

  return NextResponse.json(reading, { status: 201 });
}
