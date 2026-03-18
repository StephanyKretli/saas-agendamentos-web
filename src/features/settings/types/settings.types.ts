export type Settings = {
  name: string;
  username: string;
  timezone: string;
  bufferMinutes: number;
  minBookingNoticeMinutes: number;
  maxBookingDays: number;
};

export type UpdateSettingsInput = Settings;