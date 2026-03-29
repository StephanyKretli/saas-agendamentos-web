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
  return api.get(`/business-hours${getQuery(professionalId)}`, {
    headers: getAuthHeaders(),
  }) as Promise<BusinessHour[]>;
}

export async function createBusinessHour(
  payload: CreateBusinessHourPayload,
  professionalId?: string
): Promise<BusinessHour> {
  return api.post(`/business-hours${getQuery(professionalId)}`, payload, {
    headers: getAuthHeaders(),
  }) as Promise<BusinessHour>;
}

export async function updateBusinessHour(
  id: string,
  payload: UpdateBusinessHourPayload,
  professionalId?: string
): Promise<BusinessHour> {
  return api.patch(`/business-hours/${id}${getQuery(professionalId)}`, payload, {
    headers: getAuthHeaders(),
  }) as Promise<BusinessHour>;
}

export async function deleteBusinessHour(id: string, professionalId?: string): Promise<void> {
  return api.delete(`/business-hours/${id}${getQuery(professionalId)}`, {
    headers: getAuthHeaders(),
  }) as Promise<void>;
}

export async function applyBusinessHoursTemplate(
  payload: { sourceWeekday: number; targetWeekdays: number[]; replace?: boolean; },
  professionalId?: string
): Promise<void> {
  return api.post(`/business-hours/apply-template${getQuery(professionalId)}`, payload, {
    headers: getAuthHeaders(),
  }) as Promise<void>;
}