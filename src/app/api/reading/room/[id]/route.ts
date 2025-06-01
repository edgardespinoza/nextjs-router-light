import { findReadingByRoom } from "@/app/service/reading/getReading";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  month: z.coerce.number().gte(0),
  year: z.coerce.number().gte(0),
  roomId: z.string().uuid(),
});

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> => {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const roomId = params.id;

  const result = schema.safeParse({
    month,
    year,
    roomId,
  });

  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  const data = result.data;

  const reading = await findReadingByRoom(data.month, data.year, data.roomId);

  return NextResponse.json(reading ?? {});
};
