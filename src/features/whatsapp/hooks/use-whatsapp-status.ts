"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type WhatsappConnectionStatus = "CONNECTED" | "DISCONNECTED";

interface UseWhatsappStatusOptions {
  poll?: boolean;
}

async function fetchWhatsappStatus(salonId: string): Promise<WhatsappConnectionStatus> {
  const response = await api.get(`/whatsapp/status/${salonId}`);

  // Mesma "boneca russa" de desembrulho usada em whatsapp-connect.tsx
  const responseData = (response as any).data || response;
  const payload = responseData?.data || responseData;
  const currentStatus = payload?.status || responseData?.status;

  return currentStatus === "open" ? "CONNECTED" : "DISCONNECTED";
}

const MAX_CONSECUTIVE_FAILURES = 3;

export function useWhatsappStatus(salonId?: string, options?: UseWhatsappStatusOptions) {
  return useQuery({
    queryKey: ["whatsapp-status", salonId],
    queryFn: () => fetchWhatsappStatus(salonId as string),
    enabled: Boolean(salonId) && salonId !== "undefined",
    retry: 1,
    refetchInterval: (query) => {
      if (!options?.poll) return false;
      // Evolution API fora do ar (ex: ambiente local sem o serviço) não pode virar polling infinito
      if (query.state.fetchFailureCount >= MAX_CONSECUTIVE_FAILURES) return false;
      return 5000;
    },
  });
}
