import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  ClientHistoryResponse,
  ClientsListResponse,
} from "../types/clients.types";

export async function getClients(page: number = 1, search: string = "") {
  const response: any = await api.get("/clients", {
    params: { page, limit: 10, search },
    headers: getAuthHeaders(),
  });
  return response?.data?.data || response?.data || response; 
}

export async function getClientHistory(clientId: string): Promise<ClientHistoryResponse> {
  const response: any = await api.get(`/clients/${clientId}/history`, {
    headers: getAuthHeaders(),
  });
  return response?.data?.data || response?.data || response;
}

export async function createClient(payload: any) {
  const response: any = await api.post("/clients", payload, { headers: getAuthHeaders() });
  return response?.data?.data || response?.data || response;
}

export async function deleteClient(id: string) {
  const response: any = await api.delete(`/clients/${id}`, { headers: getAuthHeaders() });
  return response?.data?.data || response?.data || response;
}