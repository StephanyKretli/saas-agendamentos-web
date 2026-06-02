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

  // 🌟 ADICIONADO: Headers de autenticação (igual ao seu getClientHistory)
  const response = await api.get(`/clients?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  
  // 🌟 Garantia de que estamos a retornar o dado correto
  return response.data;
}

export async function getClientHistory(
  clientId: string,
): Promise<ClientHistoryResponse> {
  const response = await api.get(`/clients/${clientId}/history`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function createClient(payload: {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  const response = await api.post("/clients", payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function deleteClient(id: string) {
  const response = await api.delete(`/clients/${id}`, {
    headers: getAuthHeaders(),
  }); 
  return response.data;
}
