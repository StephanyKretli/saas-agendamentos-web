import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type {
  BusinessHour,
  CreateBusinessHourPayload,
  UpdateBusinessHourPayload,
} from "../types/business-hours.types";

export async function getBusinessHours(): Promise<BusinessHour[]> {
  // GET: (url, config)
  return api.get("/business-hours", {
    headers: getAuthHeaders(),
  }) as Promise<BusinessHour[]>;
}

export async function createBusinessHour(
  payload: CreateBusinessHourPayload
): Promise<BusinessHour> {
  // POST: (url, dados, config)
  return api.post("/business-hours", payload, {
    headers: getAuthHeaders(),
  }) as Promise<BusinessHour>;
}

export async function updateBusinessHour(
  id: string,
  payload: UpdateBusinessHourPayload
): Promise<BusinessHour> {
  // PATCH: (url, dados, config)
  return api.patch(`/business-hours/${id}`, payload, {
    headers: getAuthHeaders(),
  }) as Promise<BusinessHour>;
}

export async function deleteBusinessHour(id: string): Promise<void> {
  // DELETE: (url, config)
  return api.delete(`/business-hours/${id}`, {
    headers: getAuthHeaders(),
  }) as Promise<void>;
}