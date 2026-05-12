"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlockedSlots } from "../api/get-blocked-slots";

export function useBlockedSlots(professionalId: string) {
  return useQuery({
    queryKey: ["blocked-slots", professionalId],
    queryFn: () => getBlockedSlots(professionalId),
    // 🌟 Como a API já manda o array puro, nós só precisamos filtrá-lo diretamente
    select: (slots) => {
      const now = new Date().getTime();
      return (slots || []).filter((slot: any) => new Date(slot.end).getTime() >= now);
    },
    enabled: !!professionalId,
  });
}