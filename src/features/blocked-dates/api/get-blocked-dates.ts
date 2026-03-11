import { apiFetch } from "@/lib/api"
import { getAuthHeaders } from "@/lib/auth-headers"
import { BlockedDate } from "../types/blocked-date"

export async function getBlockedDates(): Promise<BlockedDate[]> {
  return apiFetch<BlockedDate[]>("/blocked-dates", {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  })
}