import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { BlockedSlot, CreateBlockedSlotInput } from "../types/blocked-slot";

export async function createBlockedSlot(
  data: CreateBlockedSlotInput, 
  professionalId?: string,
): Promise<BlockedSlot> {
  // 🌟 CORREÇÃO: Colocamos o professionalId JUNTO com as datas no "corpo" do payload!
  const payload = professionalId ? { ...data, professionalId } : data;

  return api.post("/blocked-slots", payload, {
    headers: getAuthHeaders(),
  }) as Promise<BlockedSlot>;
}