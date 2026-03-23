import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { PaginatedAppointmentsResponse } from "../types/appointments.types";
import { promises } from "dns";


export async function getMyAppointments(): Promise<PaginatedAppointmentsResponse> {
  return api.get("/appointments/me", {
    headers: getAuthHeaders(),
  }) as Promise<PaginatedAppointmentsResponse>;
}

export async function completeAppointment(id: string) {
  return api.patch(`/appointments/${id}/complete`, {}, {
    headers: getAuthHeaders(),
  });
}

export async function cancelAppointment(id: string) {
  return api.patch(`/appointments/${id}/cancel`, {}, {
    headers: getAuthHeaders(),
  });
}

export interface CreateAppointmentPayload {
  clientId: string;
  serviceId: string;
  notes?: string;
}

export async function createAppointment(data: CreateAppointmentPayload) {
  return api.post('/appointments', data);
}