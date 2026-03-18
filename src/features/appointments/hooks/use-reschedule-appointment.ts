"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { queryKeys } from "@/lib/query-keys";

type RescheduleInput = {
  appointmentId: string;
  date: string;
};

export function useRescheduleAppointment(currentDate: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, date }: RescheduleInput) => {
      return apiFetch(`/appointments/${appointmentId}/reschedule`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ date }),
      });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(currentDate),
      });

      const newDateOnly = variables.date.slice(0, 10);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(newDateOnly),
      });

      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });
    },
  });
}