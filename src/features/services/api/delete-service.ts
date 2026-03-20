import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"

export async function deleteService(id: string) {
  return api.delete(`/services/${id}`, {
    headers: getAuthHeaders(),
  })
}