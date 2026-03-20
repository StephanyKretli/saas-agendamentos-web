import { api } from "@/lib/api";
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
  return api.patch(`/services/${id}`, {
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
}