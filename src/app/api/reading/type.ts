export type ReadingDto = {
  id: string;
  meterWaterCurrent: number;
  meterWaterBefore: number;
  meterLightCurrent: number;
  meterLightBefore: number;
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

export const toReadingDto = (
  current: ReadingEntity,
  previous: ReadingEntity | null
): ReadingDto => {
  return {
    id: current.id,
    meterWaterCurrent: current.meterLight,
    meterLightCurrent: current.meterWater,
    meterLightBefore: previous?.meterLight ?? 0,
    meterWaterBefore: previous?.meterWater ?? 0,
    rent: previous?.rent ?? current.rent,
    year: current.year,
    month: current.month,
    room: {
      id: current.room.id,
      name: current.room.name,
    },
  };
};
