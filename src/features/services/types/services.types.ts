export type Service = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
  imageUrl?: string | null;
};

export type CreateServicePayload = {
  name: string;
  duration: number;
  priceCents: number;
};

export type ServicesListResponse =
  | Service[]
  | {
      items: Service[];
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };