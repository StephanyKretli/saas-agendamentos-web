import { apiFetch } from "@/lib/api"
import { getAuthHeaders } from "@/lib/auth-headers"

export async function deleteService(id: string) {
  return apiFetch(`/services/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
}