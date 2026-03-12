import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot, CreateBlockedSlotInput } from "../types/blocked-slot";

export async function createBlockedSlot(
  data: CreateBlockedSlotInput,
): Promise<BlockedSlot> {
  return apiFetch<BlockedSlot>("/blocked-slots", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
}