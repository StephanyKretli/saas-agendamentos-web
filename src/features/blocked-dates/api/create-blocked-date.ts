import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"
import { CreateBlockedDateInput, BlockedDate } from "../types/blocked-date"

export async function createBlockedDate(
  data: CreateBlockedDateInput,
  professionalId?: string // 🌟 1. Recebe o ID como segundo argumento
): Promise<BlockedDate> {
  // 1º arg: URL | 2º arg: dados (data) | 3º arg: config (headers e params)
  return api.post("/blocked-dates", data, {
    headers: getAuthHeaders(),
    params: { professionalId }, // 🌟 2. Envia para o NestJS salvar na agenda certa
  }) as Promise<BlockedDate>;
}