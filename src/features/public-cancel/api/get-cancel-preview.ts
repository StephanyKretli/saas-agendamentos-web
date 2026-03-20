import { api } from "@/lib/api";
import type { CancelPreviewResponse } from "../types/public-cancel.types";

export async function getCancelPreview(
  token: string,
): Promise<CancelPreviewResponse> {
  return api.get(`/public/book/cancel/${token}`);
}