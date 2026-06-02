import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { PaginatedAppointmentsResponse } from "../types/appointments.types";

export async function getMyAppointments(): Promise<PaginatedAppointmentsResponse> {
  const response = await api.get("/appointments/me", {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
}

export async function completeAppointment(id: string) {
  const response = await api.patch(`/appointments/${id}/complete`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
}

export async function cancelAppointment(id: string) {
  const response = await api.patch(`/appointments/${id}/cancel`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
}

export async function createAppointment(data: CreateAppointmentPayload) {
  const response = await api.post('/appointments', data, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
}

export async function rescheduleAppointment(id: string, date: string) {
  const response = await api.patch(`/appointments/${id}/reschedule`, { date }, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
}

export interface CreateAppointmentPayload {
  clientId: string;
  serviceId: string;
  date: string; 
  notes?: string;
  professionalId?: string; 
  isMaintenance?: boolean;
}