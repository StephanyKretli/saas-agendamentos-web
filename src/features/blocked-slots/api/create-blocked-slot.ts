import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot, CreateBlockedSlotInput } from "../types/blocked-slot";

export async function createBlockedSlot(
  data: CreateBlockedSlotInput, 
  professionalId?: string,
): Promise<BlockedSlot> {
  const payload = professionalId ? { ...data, professionalId } : data;

  const response = await api.post("/blocked-slots", payload, {
    headers: getAuthHeaders(),
  });
  
  // 🌟 Extrai os dados para manter o TypeScript feliz
  return response.data?.data || response.data;
}