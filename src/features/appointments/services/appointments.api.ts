import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { PaginatedAppointmentsResponse } from "../types/appointments.types";

export async function getMyAppointments(): Promise<PaginatedAppointmentsResponse> {
  return apiFetch<PaginatedAppointmentsResponse>("/appointments/me", {
    headers: getAuthHeaders(),
  });
}