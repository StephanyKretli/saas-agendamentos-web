export type PublicService = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
};

export type PublicBookingProfileResponse = {
  user: {
    id: string;
    name: string;
    username: string;
  };
  services: PublicService[];
};

export type PublicAvailabilityResponse = {
  date: string;
  step: number;
  slots: string[];
};