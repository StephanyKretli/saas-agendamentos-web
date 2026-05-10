"use client"

import { useQuery } from "@tanstack/react-query"
import { getBlockedDates } from "../api/get-blocked-dates"

export function useBlockedDates(professionalId?: string) {
  return useQuery({
    // 🌟 Adicionamos o professionalId na chave do cache
    queryKey: ["blocked-dates", professionalId],
    // 🌟 Repassamos o ID para a função da API
    queryFn: () => getBlockedDates(professionalId),
  })
}