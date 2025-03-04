import db from "@/db/db";
import { ReadingDomain, toReading } from "./readingDomain";

export const getReading = async (
  month: number,
  year: number
): Promise<ReadingDomain[]> => {
  const reading = await db.reading.findMany({
    where: {
      month: month,
      year: year,
    },
    include: {
      room: true,
    },
  });

  return reading.map(toReading);
};
