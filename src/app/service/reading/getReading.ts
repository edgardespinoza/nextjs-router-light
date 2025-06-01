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

export const findReadingByRoom = async (
  month: number,
  year: number,
  roomId: string
): Promise<ReadingDomain | null> => {
  const reading = await db.reading.findFirst({
    where: {
      month: month,
      year: year,
      roomId: roomId,
    },
    include: {
      room: true,
    },
  });

  if (reading == null) return null;

  return toReading(reading);
};
