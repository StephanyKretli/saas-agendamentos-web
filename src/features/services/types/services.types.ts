// src/features/services/types/services.types.ts

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  // ... outros campos
}

export interface ServicesListResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}