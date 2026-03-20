import { api } from "@/lib/api";
import type { CancelAppointmentResponse } from "../types/public-cancel.types";

export async function cancelAppointmentByToken(
  token: string,
): Promise<CancelAppointmentResponse> {
  return api.patch(`/public/book/cancel/${token}`);
}