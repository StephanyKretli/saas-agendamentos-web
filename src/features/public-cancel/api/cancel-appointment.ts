import { api } from "@/lib/api";
import type { CancelAppointmentResponse } from "../types/public-cancel.types";

export async function cancelAppointmentByToken(
  token: string,
): Promise<CancelAppointmentResponse> {
  const response: any = await api.patch(`/public/book/cancel/${token}`);
  return response?.data?.data || response?.data || response;
}