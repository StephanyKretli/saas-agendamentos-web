export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  createdAt?: string;
};

export type ClientHistoryItem = {
  id: string;
  date: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  notes?: string | null;
  service: {
    id: string;
    name: string;
    duration: number;
    priceCents: number;
  };
};

export type ClientsListResponse = {
  items: Client[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ClientHistoryResponse = ClientHistoryItem[];