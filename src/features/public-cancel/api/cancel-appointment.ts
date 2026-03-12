import { apiFetch } from "@/lib/api";
import type { CancelAppointmentResponse } from "../types/public-cancel.types";

export async function cancelAppointmentByToken(
  token: string,
): Promise<CancelAppointmentResponse> {
  return apiFetch<CancelAppointmentResponse>(`/public/book/cancel/${token}`, {
    method: "PATCH",
  });
}