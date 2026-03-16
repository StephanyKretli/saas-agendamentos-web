"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
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

export function useDayTimeline(date: string) {
  return useQuery({
    queryKey: ["appointments-day-timeline", date],
    queryFn: async () => {
      return apiFetch<DayTimelineResponse>(
        `/appointments/day-timeline?date=${date}`,
        {
          headers: getAuthHeaders(),
        },
      );
    },
    enabled: !!date,
  });
}