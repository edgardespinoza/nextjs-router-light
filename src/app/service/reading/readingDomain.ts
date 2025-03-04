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

type ReadingEntity = {
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

export const toReading = (entity: ReadingEntity): ReadingDomain => {
  return {
    id: entity.id,
    meterWater: entity.meterWater,
    meterLight: entity.meterLight,
    rent: entity.rent,
    year: entity.year,
    month: entity.month,
    room: {
      id: entity.room.id,
      name: entity.room.name,
    },
  };
};
