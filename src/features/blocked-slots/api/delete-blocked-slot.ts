import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export async function deleteBlockedSlot(id: string) {
  return apiFetch(`/blocked-slots/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
}