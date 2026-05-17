export interface PublicService {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
  description?: string | null;
  icon?: string | null;
  userId?: string;
  imageUrl?: string | null;
  professionals?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  }[];
  hasMaintenance: boolean;
  maintenanceDurationMinutes: number | null;
  maintenancePriceCents: number | null;
}

export type PublicBookingProfileResponse = {
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
  services: PublicService[];
};

export type PublicAvailabilityResponse = {
  date: string;
  step: number;
  slots: string[];
};

// 🌟 Tipagem ADICIONADA: Parâmetros da busca de horários com suporte ao Carrinho
export type UseBookingAvailabilityParams = {
  username: string;
  serviceId?: string; // Opcional (legado)
  cartItems?: { serviceId: string; isMaintenance: boolean }[]; // O array de múltiplos serviços!
  date: string | null;
  professionalId: string | null;
};

// 🌟 Tipagem ATUALIZADA: Payload de agendamento com suporte ao Carrinho
export type CreatePublicAppointmentPayload = {
  serviceId?: string; // Mantido como opcional para não quebrar códigos antigos
  isMaintenance?: boolean; // Mantido como opcional
  services?: { serviceId: string; isMaintenance: boolean }[]; // O novo array com o carrinho!
  date: string;
  professionalId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
};

// 🌟 Tipagem atualizada para casar perfeitamente com o retorno do NestJS
export type CreatePublicAppointmentResponse = {
  id: string;
  status: string;
  date: string; // O Prisma geralmente devolve date em vez de startsAt/endsAt
  client: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  requirePix?: boolean;
  pixData?: {
    transactionId: string;
    qrCodePayload: string;
    ticketUrl?: string;
  } | null;
  publicCancelPath?: string;
};