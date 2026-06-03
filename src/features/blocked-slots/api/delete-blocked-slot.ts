import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export async function deleteBlockedSlot(id: string) {
  const response = await api.delete(`/blocked-slots/${id}`, {
    headers: getAuthHeaders(),
  });
  
  // 🌟 Retorna apenas o JSON de sucesso
  return response.data?.data || response.data;
}