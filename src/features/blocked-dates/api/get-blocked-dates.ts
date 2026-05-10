import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"
import { BlockedDate } from "../types/blocked-date"

export async function getBlockedDates(
  professionalId?: string // 🌟 1. Recebe o ID
): Promise<BlockedDate[]> {
  return api.get("/blocked-dates", {
    headers: getAuthHeaders(),
    params: { professionalId } // 🌟 2. Envia como query string (?professionalId=...)
  }) as Promise<BlockedDate[]>; 
}