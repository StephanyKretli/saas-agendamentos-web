export interface Service {
  id: string;
  name: string;
  duration: number;
  priceCents: number; 
  imageUrl?: string | null;
}

export interface ServicesListResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}