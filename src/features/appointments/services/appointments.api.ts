import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { PaginatedAppointmentsResponse } from "../types/appointments.types";

export async function getMyAppointments(): Promise<PaginatedAppointmentsResponse> {
  return apiFetch<PaginatedAppointmentsResponse>("/appointments/me", {
    headers: getAuthHeaders(),
  });
}

export async function completeAppointment(id: string) {
  return apiFetch(`/appointments/${id}/complete`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
}

export async function cancelAppointment(id: string) {
  return apiFetch(`/appointments/${id}/cancel`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
}