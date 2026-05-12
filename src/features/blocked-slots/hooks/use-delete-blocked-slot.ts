"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlockedSlots } from "../api/get-blocked-slots";

export function useBlockedSlots(professionalId: string) {
  return useQuery({
    // 🌟 A MÁGICA DO FILTRO: O ID tem de estar aqui dentro dos colchetes!
    queryKey: ["blocked-slots", professionalId], 
    queryFn: () => getBlockedSlots(professionalId),
    enabled: !!professionalId, // Só busca se tiver alguém selecionado
  });
}