import db from "@/db/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { toSettingDto } from "./type";

const settingSchema = z.object({
  measure: z.number().gte(0),
  totalPrice: z.number().gte(0),
});

export const GET = async () => {
  const setting = await db.setting.findFirst({});

  let settingDto = null;

  if (setting !== null && setting.totalPrice > 0) {
    let priceKwh = setting.totalPrice / setting.measure;
    priceKwh = Number(priceKwh.toFixed(2));


    settingDto = toSettingDto({
      measure: setting.measure,
      priceKwh: priceKwh,
      totalPrice: setting.totalPrice,
    });
  }

  return NextResponse.json(settingDto ?? {});
};

export async function POST(request: Request) {
  const requestValid = await request.json();

  const result = settingSchema.safeParse(requestValid);

  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  const data = result.data;

  let setting = await db.setting.findFirst({});

  if (setting === null) {
    setting = await db.setting.create({
      data: {
        measure: data.measure,
        totalPrice: data.totalPrice,
      },
    });
  } else {
    setting = await db.setting.update({
      where: { id: setting.id },
      data: {
        measure: data.measure,
        totalPrice: data.totalPrice,
      },
    });
  }

  return NextResponse.json(setting, { status: 201 });
}
