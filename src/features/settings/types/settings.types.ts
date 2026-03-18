export type Settings = {
  name: string;
  username: string;
  timezone: string;
  bufferMinutes: number;
  minBookingNoticeMinutes: number;
  maxBookingDays: number;
  avatarUrl?: string | null;
};

export type UpdateSettingsInput = {
  name: string;
  username: string;
  timezone: string;
  bufferMinutes: number;
  minBookingNoticeMinutes: number;
  maxBookingDays: number;
};