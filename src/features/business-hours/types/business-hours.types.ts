export type BusinessHour = {
  id: string;
  weekday: number;
  start: string;
  end: string;
};

export type CreateBusinessHourPayload = {
  weekday: number;
  start: string;
  end: string;
};

export type UpdateBusinessHourPayload = {
  weekday?: number;
  start?: string;
  end?: string;
};