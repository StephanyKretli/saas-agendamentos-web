import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot } from "../types/blocked-slot";

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  return apiFetch<BlockedSlot[]>("/blocked-slots", {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
}