export type PublicService = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
};

export type PublicProfessionalProfile = {
  id: string;
  name: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  services: PublicService[];
};