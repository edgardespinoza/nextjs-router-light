import { ReadingDomain } from "@/app/service/reading/readingDomain";
import { ReadingDto } from "../reading/type";

export type ReadingsDto = ReadingDto & {
  measurePrevious: number;
};

export const toReadingsDto = (
  previous: ReadingDomain | null | undefined,
  actual: ReadingDomain
): ReadingsDto => {
  return {
    id: actual.id,
    measure: actual.measure,
    year: actual.year,
    month: actual.month,
    room: {
      id: actual.room.id,
      name: actual.room.name,
    },
    measurePrevious: previous?.measure ?? 0,
  };
};
