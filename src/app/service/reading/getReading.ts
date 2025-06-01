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

<<<<<<< HEAD
export const findReadingByRoom = async (
=======
export const getReadingByRoom = async (
>>>>>>> 5160ced (chore: add api find reading by room)
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

<<<<<<< HEAD
  if (!reading) {
    return null;
  }
=======
  if (reading == null) return null;
>>>>>>> 5160ced (chore: add api find reading by room)

  return toReading(reading);
};
