import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot } from "../types/blocked-slot";

export async function getBlockedSlots(
  professionalId?: string
): Promise<BlockedSlot[]> {
  const response: any = await api.get("/blocked-slots", {
    headers: getAuthHeaders(),
    params: { professionalId } 
  });
  
  // 🌟 Extrai a lista verdadeira, não importa quantas caixas "data" existam
  const rawData = response?.data?.data || response?.data || response;
  return Array.isArray(rawData) ? rawData : [];
}