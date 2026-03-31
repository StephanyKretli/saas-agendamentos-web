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
  role: "ADMIN" | "PROFESSIONAL";
  plan: 'STARTER' | 'PRO' | 'BUSINESS';
  maxMembers: number;
  
  // 👇 Novos campos adicionados para sincronizar com o Backend
  ownerId: string | null;
  requirePixDeposit?: boolean;
  pixDepositPercentage?: number | null;
  mercadoPagoAccessToken?: string | null;
  centralizePayments?: boolean;
  owner?: {
    centralizePayments: boolean;
  } | null;
};

export type UpdateSettingsPayload = {
  name?: string;
  username?: string;
  timezone?: string;
  bufferMinutes?: number;
  minBookingNoticeMinutes?: number;
  maxBookingDays?: number;
  requirePixDeposit?: boolean;
  pixDepositPercentage?: number;
  mercadoPagoAccessToken?: string;
  centralizePayments?: boolean;
};
