import { ReadingDomain } from "@/app/service/reading/readingDomain";
import { ReadingDto } from "../reading/type";

export const toReadingsDto = (
  previous: ReadingDomain | null | undefined,
  actual: ReadingDomain
): ReadingDto => {
  return {
    id: actual.id,
    meterLightCurrent: actual.meterLight,
    meterWaterCurrent: actual.meterWater,
    year: actual.year,
    month: actual.month,
    room: {
      id: actual.room.id,
      name: actual.room.name,
    },
    meterWaterBefore: previous?.meterLight ?? 0,
    meterLightBefore: previous?.meterWater ?? 0,
    rent: previous?.rent ?? 0,
  };
};
