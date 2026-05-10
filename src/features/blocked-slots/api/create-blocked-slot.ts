import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot, CreateBlockedSlotInput } from "../types/blocked-slot";

export async function createBlockedSlot(
  data: CreateBlockedSlotInput, 
  professionalId?: string,
): Promise<BlockedSlot> {
  // O Axios recebe 3 argumentos no POST: URL, Payload (data), e Configurações
  return api.post("/blocked-slots", data, {
    headers: getAuthHeaders(),
    params: { professionalId } // 🌟 Aqui está! Isso transforma a requisição em /blocked-slots?professionalId=123
  }) as Promise<BlockedSlot>;
}