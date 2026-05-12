import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot } from "../types/blocked-slot";

export async function getBlockedSlots(professionalId?: string): Promise<BlockedSlot[]> {
  return api.get("/blocked-slots", {
    headers: getAuthHeaders(),
    params: { professionalId } // 🌟 A MÁGICA DO FILTRO AQUI
  }) as Promise<BlockedSlot[]>;
}