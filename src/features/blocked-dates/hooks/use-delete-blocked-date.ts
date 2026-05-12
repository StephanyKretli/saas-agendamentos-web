"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlockedDates } from "../api/get-blocked-dates";

export function useBlockedDates(professionalId: string) {
  return useQuery({
    // 🌟 O ID TAMBÉM VEM PARA AQUI!
    queryKey: ["blocked-dates", professionalId],
    queryFn: () => getBlockedDates(professionalId),
    enabled: !!professionalId,
  });
}