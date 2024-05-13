export type ReadingDto = {
  id: string;
  value: number;
  year: number;
  month: number;
  room: {
    name: string;
    id: string;
  };
};

export const readingDtoFromReading = ({
  id,
  value,
  year,
  month,
  room,
}: {
  id: string;
  value: number;
  year: number;
  month: number;
  room: { name: string; id: string };
}): ReadingDto => {
  return {
    id: id,
    value: value,
    year: year,
    month: month,
    room: {
      id: room.id,
      name: room.name,
    },
  };
};
