import { apiFetch } from "@/lib/api"
import { getAuthHeaders } from "@/lib/auth-headers"

export type UpdateServiceInput = {
  id: string
  name?: string
  duration?: number
  priceCents?: number
}

export async function updateService({
  id,
  ...data
}: UpdateServiceInput) {
  return apiFetch(`/services/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
}