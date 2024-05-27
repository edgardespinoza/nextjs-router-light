export type ReadingDomain = {
    id: string;
    measure: number;
    year: number;
    month: number;
    room: {
      name: string;
      id: string;
    };
  };
  
  export const toReading = ({
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
  }): ReadingDomain => {
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
  