import db from "@/db/db";
import { ReadingDomain, toReading } from "./readingDomain";

export const getReading = async (
  month: number,
  year: number
): Promise<ReadingDomain[]> => {
  if (month <= 0) {
    month = 12;
    year = year - 1;
  }

  const reading = await db.reading.findMany({
    where: {
      month: month,
      year: year,
    },
    include: {
      room: true,
    }
  });

  return reading.map(toReading);
};
