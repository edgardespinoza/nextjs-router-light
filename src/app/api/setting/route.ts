import db from "@/db/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { toSettingDto } from "./type";

const settingSchema = z.object({
  priceWater: z.number().gte(0),
  priceLight: z.number().gte(0),
});

export const GET = async () => {
  const setting = await db.setting.findFirst({});

  let settingDto = null;

  if (setting !== null) {
    settingDto = toSettingDto({
      priceLight: setting.priceLight,
      priceWater: setting.priceWater,
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
        priceLight: data.priceLight,
        priceWater: data.priceWater,
      },
    });
  } else {
    setting = await db.setting.update({
      where: { id: setting.id },
      data: {
        priceLight: data.priceLight,
        priceWater: data.priceWater,
      },
    });
  }

  return NextResponse.json(setting, { status: 201 });
}
