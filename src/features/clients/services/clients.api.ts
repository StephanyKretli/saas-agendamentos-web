import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  ClientHistoryResponse,
  ClientsListResponse,
} from "../types/clients.types";

export async function getClients(): Promise<ClientsListResponse> {
  return apiFetch<ClientsListResponse>("/clients", {
    headers: getAuthHeaders(),
  });
}

export async function getClientHistory(
  clientId: string,
): Promise<ClientHistoryResponse> {
  return apiFetch<ClientHistoryResponse>(`/clients/${clientId}/history`, {
    headers: getAuthHeaders(),
  });
}