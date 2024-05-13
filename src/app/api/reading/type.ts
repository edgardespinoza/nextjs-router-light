export type ReadingDto = {
  value: number;
  year: number;
  month: number;
  room: {
    name: string;
    id: string;
  };
};

export const readingDtoFromReading = ({
  value,
  year,
  month,
  room,
}: {
  value: number;
  year: number;
  month: number;
  room: { name: string; id: string };
}): ReadingDto => {
  return {
    value: value,
    year: year,
    month: month,
    room: room,
  };
};
