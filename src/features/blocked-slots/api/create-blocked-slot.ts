import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot, CreateBlockedSlotInput } from "../types/blocked-slot";

export async function createBlockedSlot(
  data: CreateBlockedSlotInput,
): Promise<BlockedSlot> {
  return api.post("/blocked-slots", data, {
    headers: getAuthHeaders(),
  }) as Promise<BlockedSlot>;
}