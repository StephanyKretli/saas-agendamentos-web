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
  return response?.data?.data ?? response?.data ?? response;
}

export async function createService(payload: CreateServicePayload): Promise<Service> {
  const response: any = await api.post("/services", payload, {
    headers: getAuthHeaders()
  });
  return response?.data?.data ?? response?.data ?? response;
}

export async function updateService(id: string, payload: Partial<CreateServicePayload>): Promise<Service> {
  const response: any = await api.patch(`/services/${id}`, payload, {
    headers: getAuthHeaders()
  });
  return response?.data?.data ?? response?.data ?? response;
}

// 🌟 NOVO: Trouxemos o delete para o arquivo centralizado!
export async function deleteService(id: string): Promise<void> {
  const response: any = await api.delete(`/services/${id}`, {
    headers: getAuthHeaders()
  });
  return response?.data?.data ?? response?.data ?? response;
}