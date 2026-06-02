"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export type TimelineItem =
  | { type: "free"; start: string; end: string; }
  | { type: "blocked"; start: string; end: string; }
  | {
      type: "busy";
      start: string;
      end: string;
      appointmentId: string;
      status: string;
      notes: string | null;
      professionalId?: string; 
      userId?: string;
      service: { id: string; name: string; duration: number; priceCents: number; };
      client: { id: string; name: string; phone: string | null; email: string | null; } | null;
    };

type DayTimelineResponse = {
  date: string;
  items: TimelineItem[];
};

export function useDayTimeline(date: string, professionalId?: string) {
  return useQuery({
    queryKey: ["appointments-day-timeline", date, professionalId],
    queryFn: async () => {
      const params = new URLSearchParams({ date });
      if (professionalId) {
        params.append("professionalId", professionalId);
      }

      const response = await api.get(
        `/appointments/day-timeline?${params.toString()}`,
        { headers: getAuthHeaders() }
      );
      
      // 🌟 A MÁGICA: Extrai os dados reais da resposta do Axios
      return (response.data?.data || response.data) as DayTimelineResponse; 
    },
    enabled: !!date,
  });
}