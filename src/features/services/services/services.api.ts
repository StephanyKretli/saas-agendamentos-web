import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  CreateServicePayload,
  Service,
  ServicesListResponse,
} from "../types/services.types";

export async function getServices(): Promise<ServicesListResponse> {
  return apiFetch<ServicesListResponse>("/services/me", {
    headers: getAuthHeaders(),
  });
}

export async function createService(payload: CreateServicePayload) {
  return apiFetch<Service>("/services", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}