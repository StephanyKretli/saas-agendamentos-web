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

export type CreatePublicAppointmentPayload = {
  serviceId: string;
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