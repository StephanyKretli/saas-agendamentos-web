"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlockedSlots } from "../api/get-blocked-slots";

export function useBlockedSlots() {
  return useQuery({
    queryKey: ["blocked-slots"],
    queryFn: getBlockedSlots,
  });
}