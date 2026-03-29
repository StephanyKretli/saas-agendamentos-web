export interface PublicService {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
  icon?: string;
  userId?: string;
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

export type CreatePublicAppointmentResponse = {
  id: string;
  status: string;
  startsAt: string;
  endsAt: string;
  client: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  paymentStatus?: string;
  depositCents?: number | null;
  pixPayload?: string | null;
  service: {
    id: string;
    name: string;
    duration: number;
    priceCents: number;
  };
};