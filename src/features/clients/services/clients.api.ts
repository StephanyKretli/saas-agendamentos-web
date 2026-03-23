import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  ClientHistoryResponse,
  ClientsListResponse,
} from "../types/clients.types";

export async function getClients(): Promise<ClientsListResponse> {
  return api.get("/clients", {
    headers: getAuthHeaders(),
  }) as Promise<ClientsListResponse>;
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