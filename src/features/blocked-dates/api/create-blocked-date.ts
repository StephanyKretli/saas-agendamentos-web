import { apiFetch } from "@/lib/api"
import { getAuthHeaders } from "@/lib/auth-headers"
import { CreateBlockedDateInput, BlockedDate } from "../types/blocked-date"

export async function createBlockedDate(
  data: CreateBlockedDateInput,
): Promise<BlockedDate> {
  return apiFetch<BlockedDate>("/blocked-dates", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
}