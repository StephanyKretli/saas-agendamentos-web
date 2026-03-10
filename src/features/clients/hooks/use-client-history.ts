"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientHistory } from "../services/clients.api";

export function useClientHistory(clientId: string | null) {
  return useQuery({
    queryKey: ["clients", "history", clientId],
    queryFn: () => getClientHistory(clientId!),
    enabled: !!clientId,
  });
}