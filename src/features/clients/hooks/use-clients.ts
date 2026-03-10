"use client";

import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/clients.api";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
}