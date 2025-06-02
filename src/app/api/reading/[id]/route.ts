import { findReadingByRoom } from "@/app/service/reading/getReading";
import db from "@/db/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { toReadingDto } from "../type";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const existingReading = await db.reading.findUnique({
      where: { id: id },
    });

    if (!existingReading) {
      return NextResponse.json(
        { error: "Reading not found" },
        {
          status: 404,
        }
      );
    }

    const reading = await db.reading.delete({
      where: { id: id },
    });

    return NextResponse.json(reading);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    let reading = await db.reading.findUnique({
      where: { id: id },

      include: {
        room: true,
      },
    });

    if (reading == null) {
      return NextResponse.json(
        { error: "Reading not found" },
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server Error" },
      { status: 500 }
    );
  }
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
  try {
    const id = params.id;

    const requestValid = await request.json();

    const result = readingSchema.safeParse(requestValid);

    if (!result.success) {
      return NextResponse.json(result.error.formErrors.fieldErrors, {
        status: 400,
      });
    }

    const existingReading = await db.reading.findUnique({
      where: { id: id },
    });

    if (!existingReading) {
      return NextResponse.json({ error: "Reading not found" }, { status: 404 });
    }

    const data = result.data;

    const updatedReading = await db.reading.update({
      where: {
        id: id,
      },
      data: {
        meterWater: data.meterWater,
        meterLight: data.meterLight,
        rent: data.rent,
      },
    });

    return NextResponse.json(updatedReading, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
