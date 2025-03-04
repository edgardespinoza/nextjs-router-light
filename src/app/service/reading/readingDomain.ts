export type ReadingDomain = {
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

export const toReading = ({
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
}): ReadingDomain => {
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
