import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  ClientHistoryResponse,
  ClientsListResponse,
} from "../types/clients.types";

export async function getClients(page: number = 1, search: string = "") {
  // O response aqui é um objeto Axios padrão
  const response = await api.get("/clients", {
    params: { page, limit: 10, search },
    headers: getAuthHeaders(),
  });
  return response.data.data; 
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
