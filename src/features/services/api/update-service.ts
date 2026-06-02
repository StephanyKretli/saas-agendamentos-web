import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"

export type UpdateServiceInput = {
  id: string
  name?: string
  duration?: number
  priceCents?: number
}

export async function updateService({ id, ...data }: UpdateServiceInput) {
  // CORREÇÃO: Removido o 'body: JSON.stringify(data)'. O Axios já faz isso sozinho.
  const response: any = await api.patch(`/services/${id}`, data, {
    headers: getAuthHeaders(),
  })
  
  return response?.data?.data ?? response?.data ?? response;
}
