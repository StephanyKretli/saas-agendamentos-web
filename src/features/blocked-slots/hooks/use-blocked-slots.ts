"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlockedSlots } from "../api/get-blocked-slots";

// 🌟 1. Aceita o professionalId como parâmetro
export function useBlockedSlots(professionalId?: string) {
  return useQuery({
    // 🌟 2. Adiciona o ID na chave para isolar o cache por profissional
    queryKey: ["blocked-slots", professionalId],
    // 🌟 3. Repassa o ID para a sua função de API
    queryFn: () => getBlockedSlots(professionalId),
  });
}