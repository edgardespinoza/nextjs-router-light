export type ReadingDto = {
  id: string;
  measure: number;
  year: number;
  month: number;
  room: {
    name: string;
    id: string;
  };
};

export const readingDtoFromReading = ({
  id,
  measure,
  year,
  month,
  room,
}: {
  id: string;
  measure: number;
  year: number;
  month: number;
  room: { name: string; id: string };
}): ReadingDto => {
  return {
    id: id,
    measure: measure,
    year: year,
    month: month,
    room: {
      id: room.id,
      name: room.name,
    },
  };
};
