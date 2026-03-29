import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { ClientHistoryResponse } from "../types/clients.types";

export function useClientHistory(clientId: string | null, from?: string, to?: string) {
  return useQuery({
    queryKey: ["client-history", clientId, from, to],
    queryFn: async () => {
      if (!clientId) return null;
      
      // Monta os parâmetros de URL caso as datas existam
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      
      const queryString = params.toString() ? `?${params.toString()}` : "";
      
      const response = await api.get(`/clients/${clientId}/history${queryString}`, {
        headers: getAuthHeaders(),
      });
      return response as unknown as ClientHistoryResponse;
    },
    enabled: !!clientId,
  });
}