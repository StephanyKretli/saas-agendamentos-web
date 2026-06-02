import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  BusinessHour,
  CreateBusinessHourPayload,
  UpdateBusinessHourPayload,
} from "../types/business-hours.types";

function getQuery(professionalId?: string) {
  return professionalId ? `?professionalId=${professionalId}` : "";
}

export async function getBusinessHours(professionalId?: string): Promise<BusinessHour[]> {
  const response: any = await api.get(`/business-hours${getQuery(professionalId)}`, {
    headers: getAuthHeaders(),
  });
  
  // 🛡️ Desempacota o array de horários
  return response?.data?.data ?? response?.data ?? response;
}

export async function createBusinessHour(
  payload: CreateBusinessHourPayload,
  professionalId?: string
): Promise<BusinessHour> {
  const response: any = await api.post(`/business-hours${getQuery(professionalId)}`, payload, {
    headers: getAuthHeaders(),
  });
  
  return response?.data?.data ?? response?.data ?? response;
}

export async function updateBusinessHour(
  id: string,
  payload: UpdateBusinessHourPayload,
  professionalId?: string
): Promise<BusinessHour> {
  const response: any = await api.patch(`/business-hours/${id}${getQuery(professionalId)}`, payload, {
    headers: getAuthHeaders(),
  });
  
  return response?.data?.data ?? response?.data ?? response;
}

export async function deleteBusinessHour(id: string, professionalId?: string): Promise<void> {
  const response: any = await api.delete(`/business-hours/${id}${getQuery(professionalId)}`, {
    headers: getAuthHeaders(),
  });
  
  return response?.data?.data ?? response?.data ?? response;
}

export async function applyBusinessHoursTemplate(
  payload: { sourceWeekday: number; targetWeekdays: number[]; replace?: boolean; },
  professionalId?: string
): Promise<void> {
  const response: any = await api.post(`/business-hours/apply-template${getQuery(professionalId)}`, payload, {
    headers: getAuthHeaders(),
  });
  
  return response?.data?.data ?? response?.data ?? response;
}
