"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlockedDates } from "../api/get-blocked-dates";

export function useBlockedDates(professionalId: string) {
  return useQuery({
    queryKey: ["blocked-dates", professionalId],
    queryFn: () => getBlockedDates(professionalId),
    // 🌟 Mesma coisa aqui: recebe as datas e filtra direto!
    select: (dates) => {
      const now = new Date().getTime();
      return (dates || []).filter((item: any) => {
        const dateTime = new Date(item.date).getTime();
        return (dateTime + 86400000) >= now; 
      });
    },
    enabled: !!professionalId,
  });
}