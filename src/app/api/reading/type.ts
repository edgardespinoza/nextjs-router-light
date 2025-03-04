export type ReadingDto = {
  id: string;
  meterWater: number;
  meterLight: number;
  rent: number;
  year: number;
  month: number;
  room: {
    name: string;
    id: string;
  };
};

export const toReadingDto = ({
  id,
  meterWater,
  meterLight,
  rent,
  year,
  month,
  room,
}: {
  id: string;
  meterWater: number;
  meterLight: number;
  rent: number;
  year: number;
  month: number;
  room: { name: string; id: string };
}): ReadingDto => {
  return {
    id: id,
    meterWater: meterWater,
    meterLight: meterLight,
    rent: rent,
    year: year,
    month: month,
    room: {
      id: room.id,
      name: room.name,
    },
  };
};
