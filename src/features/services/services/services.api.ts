import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  CreateServicePayload,
  Service,
  ServicesListResponse,
} from "../types/services.types";

export async function getServices(): Promise<ServicesListResponse> {
  return api.get("/services/me", {
    headers: getAuthHeaders()
  }) as Promise<ServicesListResponse>;
}

export async function createService(payload: CreateServicePayload): Promise<Service> {
  return api.post("/services", payload, {
    headers: getAuthHeaders()
  }) as Promise<Service>;
}

// 🌟 FUNÇÃO NOVA PARA ATUALIZAR O SERVIÇO
export async function updateService(id: string, payload: Partial<CreateServicePayload>): Promise<Service> {
  return api.patch(`/services/${id}`, payload, {
    headers: getAuthHeaders()
  }) as Promise<Service>;
}