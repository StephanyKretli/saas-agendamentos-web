import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { CreateBlockedDateInput, BlockedDate } from "../types/blocked-date";

export async function createBlockedDate(
  data: CreateBlockedDateInput,
  professionalId?: string 
): Promise<BlockedDate> {
  const payload = professionalId ? { ...data, professionalId } : data;

  const response = await api.post("/blocked-dates", payload, {
    headers: getAuthHeaders(),
  });
  
  // 🌟 Extrai os dados em vez de devolver o objeto do Axios
  return response.data?.data || response.data;
}