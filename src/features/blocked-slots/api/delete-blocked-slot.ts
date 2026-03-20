import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export async function deleteBlockedSlot(id: string) {
  return api.delete(`/blocked-slots/${id}`, {
    headers: getAuthHeaders(),
  });
}