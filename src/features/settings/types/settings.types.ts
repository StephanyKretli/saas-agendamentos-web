export type UserSettings = {
  id: string;
  name: string;
  username: string;
  email?: string; 
  phone?: string; 
  bio?: string;  
  timezone: string | null;
  bufferMinutes: number | null;
  minBookingNoticeMinutes: number | null;
  maxBookingDays: number | null;
  avatarUrl: string | null;
};

export type UpdateSettingsPayload = {
  name?: string;
  username?: string;
  timezone?: string;
  bufferMinutes?: number;
  minBookingNoticeMinutes?: number;
  maxBookingDays?: number;
};