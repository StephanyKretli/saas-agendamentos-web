export type PublicService = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
};

export type PublicProfileResponse = {
  user: {
    id: string;
    name: string;
    username: string;
  };
  services: PublicService[];
};

export type AvailabilityResponse = {
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

export type CreatedAppointmentResponse = {
  id: string;
  date: string;
  notes?: string | null;
  status: string;
  createdAt: string;
  service: {
    id: string;
    name: string;
    duration: number;
    priceCents: number;
  };
  client?: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  } | null;
};