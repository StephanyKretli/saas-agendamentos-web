import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"

export async function deleteBlockedDate(id: string): Promise<void> {
  await api.delete(`/blocked-dates/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
}

