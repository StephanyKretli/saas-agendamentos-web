import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { CreateBlockedDateInput, BlockedDate } from "../types/blocked-date";

export async function createBlockedDate(
  data: CreateBlockedDateInput,
  professionalId?: string 
): Promise<BlockedDate> {
  // 🌟 O mesmo aqui: junta tudo no mesmo pacote (payload)
  const payload = professionalId ? { ...data, professionalId } : data;

  return api.post("/blocked-dates", payload, {
    headers: getAuthHeaders(),
  }) as Promise<BlockedDate>;
}