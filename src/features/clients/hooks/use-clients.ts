import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/clients.api";

export function useClients(page: number = 1, search: string = "") {
  return useQuery({
    queryKey: ["clients", page, search],
    queryFn: () => getClients(page, search),
  });
}
