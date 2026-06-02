import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  CreateServicePayload,
  Service,
  ServicesListResponse,
} from "../types/services.types";

export async function getServices(): Promise<ServicesListResponse> {
  const response: any = await api.get("/services/me", {
    headers: getAuthHeaders()
  });
  
  // 🛡️ O segredo: desempacotando a lista de serviços!
  return response?.data?.data ?? response?.data ?? response;
}

export async function createService(payload: CreateServicePayload): Promise<Service> {
  const response: any = await api.post("/services", payload, {
    headers: getAuthHeaders()
  });
  
  return response?.data?.data ?? response?.data ?? response;
}

// 🌟 FUNÇÃO PARA ATUALIZAR O SERVIÇO BLINDADA
export async function updateService(id: string, payload: Partial<CreateServicePayload>): Promise<Service> {
  const response: any = await api.patch(`/services/${id}`, payload, {
    headers: getAuthHeaders()
  });
  
  return response?.data?.data ?? response?.data ?? response;
}
