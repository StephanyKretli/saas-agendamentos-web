"use client";

import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/clients.api";

export function useClients(page: number) {
  return useQuery({
    queryKey: ["clients", page],
    queryFn: () => getClients(page),
  });
}
