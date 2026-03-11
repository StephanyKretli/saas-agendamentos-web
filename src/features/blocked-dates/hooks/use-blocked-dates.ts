"use client"

import { useQuery } from "@tanstack/react-query"
import { getBlockedDates } from "../api/get-blocked-dates"

export function useBlockedDates() {
  return useQuery({
    queryKey: ["blocked-dates"],
    queryFn: getBlockedDates,
  })
}