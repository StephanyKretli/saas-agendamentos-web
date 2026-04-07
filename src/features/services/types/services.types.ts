export interface ServicesListResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Service = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
  imageUrl?: string | null;
  icon?: string | null; 
  professionals?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  }[];
};

export type CreateServicePayload = {
  name: string;
  duration: number;
  priceCents: number;          // Usando priceCents como o formulário pede
  icon: string;                // Usando icon
  professionalIds: string[];   // Lista de profissionais
  description?: string | null; // Opcional
};