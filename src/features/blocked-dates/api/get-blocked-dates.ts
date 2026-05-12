import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"
import { BlockedDate } from "../types/blocked-date"

export async function getBlockedDates(
  professionalId?: string
): Promise<BlockedDate[]> {
  // 🌟 1. Guardamos a "caixa" que vem da API numa variável
  const response = await api.get("/blocked-dates", {
    headers: getAuthHeaders(),
    params: { professionalId } 
  });
  
  // 🌟 2. Devolvemos APENAS os dados puros (a sua lista real)
  return response.data;
}