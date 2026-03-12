import { apiFetch } from "@/lib/api";
import type { CancelPreviewResponse } from "../types/public-cancel.types";

export async function getCancelPreview(
  token: string,
): Promise<CancelPreviewResponse> {
  return apiFetch<CancelPreviewResponse>(`/public/book/cancel/${token}`, {
    method: "GET",
  });
}