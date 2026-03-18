export type PublicService = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
  imageUrl?: string | null;
};

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
  service: {
    id: string;
    name: string;
    duration: number;
    priceCents: number;
  };
};