import { findReadingByRoom } from "@/app/service/reading/getReading";
import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const readingSchema = z.object({
  roomId: z.string().uuid(),
  meterWater: z.number().gte(0),
  meterLight: z.number().gte(0),
  rent: z.number().gte(0),
  month: z.number().gte(0).lte(13),
  year: z.number().gte(2000),
});

export async function POST(request: Request) {
  const requestValid = await request.json();

  const result = readingSchema.safeParse(requestValid);

  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  const data = result.data;

  let reading = await db.reading.findFirst({
    where: {
      month: data.month,
      year: data.year,
      roomId: data.roomId,
    },
  });

  if (reading === null) {
    reading = await db.reading.create({
      data: {
        meterLight: data.meterLight,
        meterWater: data.meterWater,
        rent: data.rent,
        month: data.month,
        roomId: data.roomId,
        year: data.year,
      },
    });
  } else {
    reading = await db.reading.update({
      where: {
        id: reading.id,
      },
      data: {
        meterLight: data.meterLight,
        meterWater: data.meterWater,
        rent: data.rent,
      },
    });
  }
  return NextResponse.json(reading, { status: 201 });
}

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const roomId = searchParams.get("roomId");

  const zValid = z.coerce.number().gte(0);
  const zNotEmpty = z.coerce.string().min(1).uuid();

  const result =
    zValid.parse(month) && zValid.parse(year) && zNotEmpty.parse(roomId);

  if (!result) {
    return NextResponse.json(
      { error: "month or year is not number and roomid not empty" },
      {
        status: 400,
      }
    );
  }

  const reading = await findReadingByRoom(
    Number(month),
    Number(year),
    roomId!!
  );

  return NextResponse.json(reading);
};
