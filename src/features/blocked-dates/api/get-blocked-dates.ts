import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedDate } from "../types/blocked-date";

export async function getBlockedDates(
  professionalId?: string
): Promise<BlockedDate[]> {
  const response: any = await api.get("/blocked-dates", {
    headers: getAuthHeaders(),
    params: { professionalId } 
  });
  
  // 🌟 Extrai a lista verdadeira
  const rawData = response?.data?.data || response?.data || response;
  return Array.isArray(rawData) ? rawData : [];
}