import { ReadingDomain } from "@/app/service/reading/readingDomain";
import { ReadingDto } from "../reading/type";

export type ReadingsDto = ReadingDto & {
  meterLightPrevious: number;
  meterWaterPrevious: number;
  rentPrevious: number;
};

export const toReadingsDto = (
  previous: ReadingDomain | null | undefined,
  actual: ReadingDomain
): ReadingsDto => {
  return {
    id: actual.id,
    meterLight: actual.meterLight,
    meterWater: actual.meterWater,
    rent: actual.rent,
    year: actual.year,
    month: actual.month,
    room: {
      id: actual.room.id,
      name: actual.room.name,
    },
    meterLightPrevious: previous?.meterLight ?? 0,
    meterWaterPrevious: previous?.meterWater ?? 0,
    rentPrevious: previous?.rent ?? 0,
  };
};
