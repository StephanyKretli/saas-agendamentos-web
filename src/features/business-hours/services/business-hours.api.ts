import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  BusinessHour,
  CreateBusinessHourPayload,
  UpdateBusinessHourPayload,
} from "../types/business-hours.types";

export async function getBusinessHours(): Promise<BusinessHour[]> {
  return apiFetch<BusinessHour[]>("/business-hours", {
    headers: getAuthHeaders(),
  });
}

export async function createBusinessHour(payload: CreateBusinessHourPayload) {
  return apiFetch<BusinessHour>("/business-hours", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateBusinessHour(
  id: string,
  payload: UpdateBusinessHourPayload,
) {
  return apiFetch<BusinessHour>(`/business-hours/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteBusinessHour(id: string) {
  return apiFetch(`/business-hours/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}