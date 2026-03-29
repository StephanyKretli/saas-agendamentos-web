"use client";

import { useQuery } from "@tanstack/react-query";
import { getBusinessHours } from "../services/business-hours.api";

export function useBusinessHours(professionalId?: string) {
  return useQuery({
    queryKey: ["business-hours", professionalId],
    queryFn: () => getBusinessHours(professionalId),
  });
}