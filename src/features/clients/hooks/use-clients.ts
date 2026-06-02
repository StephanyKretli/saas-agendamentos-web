"use client";

import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/clients.api";

export function useClients(page: number = 1, search: string = "") {
  return useQuery({
    queryKey: ["clients", page, search], // O React Query atualiza sempre que page ou search mudar
    queryFn: () => getClients(page, search),
  });
}
