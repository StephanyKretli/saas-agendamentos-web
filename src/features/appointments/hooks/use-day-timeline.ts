"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export type TimelineItem =
  | {
      type: "free";
      start: string;
      end: string;
    }
  | {
      type: "blocked";
      start: string;
      end: string;
    }
  | {
      type: "busy";
      start: string;
      end: string;
      appointmentId: string;
      status: string;
      notes: string | null;
      service: {
        id: string;
        name: string;
        duration: number;
        priceCents: number;
      };
      client: {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
      } | null;
    };

type DayTimelineResponse = {
  date: string;
  items: TimelineItem[];
};

// 👇 1. Recebemos o professionalId como segundo parâmetro (opcional)
export function useDayTimeline(date: string, professionalId?: string) {
  return useQuery({
    // 👇 2. Adicionamos na queryKey. Se o ID mudar, o React Query refaz a busca!
    queryKey: ["appointments-day-timeline", date, professionalId],
    queryFn: async () => {
      // Monta os parâmetros da URL de forma segura
      const params = new URLSearchParams({ date });
      
      // 👇 3. Se houver um profissional selecionado, adiciona à URL
      if (professionalId) {
        params.append("professionalId", professionalId);
      }

      return api.get(
        `/appointments/day-timeline?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      ) as Promise<DayTimelineResponse>; 
    },
    enabled: !!date,
  });
}