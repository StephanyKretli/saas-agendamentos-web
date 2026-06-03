import { api } from "@/lib/api";
import type { CancelPreviewResponse } from "../types/public-cancel.types";

export async function getCancelPreview(
  token: string,
): Promise<CancelPreviewResponse> {
  const response: any = await api.get(`/public/book/cancel/${token}`);
  return response?.data?.data || response?.data || response;
}