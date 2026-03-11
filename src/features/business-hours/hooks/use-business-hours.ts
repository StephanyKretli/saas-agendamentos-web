"use client";

import { useQuery } from "@tanstack/react-query";
import { getBusinessHours } from "../services/business-hours.api";

export function useBusinessHours() {
  return useQuery({
    queryKey: ["business-hours"],
    queryFn: getBusinessHours,
  });
}