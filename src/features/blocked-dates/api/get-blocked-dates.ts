import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"
import { BlockedDate } from "../types/blocked-date"

export async function getBlockedDates(): Promise<BlockedDate[]> {
  return api.get("/blocked-dates", {
    headers: getAuthHeaders()
  }) as Promise<BlockedDate[]>; 
}
