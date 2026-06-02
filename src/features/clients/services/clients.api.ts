import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  ClientHistoryResponse,
  ClientsListResponse,
} from "../types/clients.types";

export async function getClients(page: number = 1, search: string = ""): Promise<ClientsListResponse> {
  // Passamos os parâmetros corretamente para o Axios
  const { data } = await api.get("/clients", {
    headers: getAuthHeaders(),
    params: { page, limit: 10, search }
  });
  
  // Retornamos apenas o JSON com { items, page, ... }
  return data;
}

// ... (mantenha os outros exports igual, mas aplique o { data } = await se necessário)
export async function getClientHistory(clientId: string): Promise<ClientHistoryResponse> {
  const { data } = await api.get(`/clients/${clientId}/history`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function createClient(payload: any) {
  const { data } = await api.post("/clients", payload, { headers: getAuthHeaders() });
  return data;
}

export async function deleteClient(id: string) {
  const { data } = await api.delete(`/clients/${id}`, { headers: getAuthHeaders() });
  return data;
}
