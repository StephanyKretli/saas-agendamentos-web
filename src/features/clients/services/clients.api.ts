import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  ClientHistoryResponse,
  ClientsListResponse,
} from "../types/clients.types";

export async function getClients(page: number = 1, search: string = "") {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", "10");
  
  if (search) {
    params.append("search", search);
  }

  const response = await api.get(`/clients?${params.toString()}`);
  return response.data;
}

export async function getClientHistory(
  clientId: string,
): Promise<ClientHistoryResponse> {
  return api.get(`/clients/${clientId}/history`, {
    headers: getAuthHeaders(),
  }) as Promise<ClientHistoryResponse>;
}

export async function createClient(payload: {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  return api.post("/clients", payload);
}

export async function deleteClient(id: string) {
  const response = await api.delete(`/clients/${id}`); 
  return response.data;
}
