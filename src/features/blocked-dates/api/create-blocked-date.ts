import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"
import { CreateBlockedDateInput, BlockedDate } from "../types/blocked-date"

export async function createBlockedDate(
  data: CreateBlockedDateInput,
): Promise<BlockedDate> {
  // 1º arg: URL | 2º arg: dados (data) | 3º arg: config (headers)
  return api.post("/blocked-dates", data, {
    headers: getAuthHeaders(),
  }) as Promise<BlockedDate>;
}