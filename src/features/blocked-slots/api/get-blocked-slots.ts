import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot } from "../types/blocked-slot";

export async function getBlockedSlots(
  professionalId?: string
): Promise<BlockedSlot[]> {
  // 🌟 1. Mesma coisa aqui, guardamos a resposta
  const response = await api.get("/blocked-slots", {
    headers: getAuthHeaders(),
    params: { professionalId } 
  });
  
  // 🌟 2. E entregamos só o array limpo!
  return response.data;
}