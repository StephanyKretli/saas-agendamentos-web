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
  
  ownerId: string | null;
  requirePixDeposit?: boolean;
  pixDepositPercentage?: number | null;
  /**
   * O access token do Mercado Pago NAO volta mais do backend em texto puro.
   * O client so recebe se esta configurado e os ultimos digitos (conferencia).
   * A escrita continua normal: envie o token novo em UpdateFinancialPayload.
   */
  mercadoPagoAccessTokenConfigured?: boolean;
  mercadoPagoAccessTokenPreview?: string | null;
  centralizePayments?: boolean;
  isSoloProfessional?: boolean;
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
  isSoloProfessional?: boolean;
};

// Criando apelidos para evitar erros de importação em outros arquivos
export type Settings = UserSettings;
export type UpdateSettingsInput = UpdateSettingsPayload;