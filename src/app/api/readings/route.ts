import { getReading } from "@/app/service/reading/getReading";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { toReadingsDto } from "./type";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const zValid = z.coerce.number().gte(0);

  const result = zValid.parse(month) && zValid.parse(year);

  if (!result) {
    return NextResponse.json(
      { error: "month or year is not number" },
      {
        status: 400,
      }
    );
  }

  const readings = await getReading(Number(month), Number(year));

  let monthPrevious = Number(month) - 1;
  let yearPrevious = Number(year);
  if (monthPrevious <= 0) {
    monthPrevious = 12;
    yearPrevious = yearPrevious - 1;
  }

  const readingsPrevious = await getReading(monthPrevious, yearPrevious);

  const readingsDto = readings.map((item) => {
    const result = readingsPrevious.find(
      (previous) => previous.room.id === item.room.id
    );
    return toReadingsDto(result, item);
  });

  return NextResponse.json(readingsDto);
};
