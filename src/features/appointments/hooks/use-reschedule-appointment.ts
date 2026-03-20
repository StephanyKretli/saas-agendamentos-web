"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
      return api.patch(`/appointments/${appointmentId}/reschedule`, {}, {
        headers: getAuthHeaders()
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