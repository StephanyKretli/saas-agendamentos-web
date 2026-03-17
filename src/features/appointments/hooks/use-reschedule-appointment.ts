"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export function useRescheduleAppointment(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      newDate,
    }: {
      appointmentId: string;
      newDate: string;
    }) => {
      return apiFetch(`/appointments/${appointmentId}/reschedule`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          date: newDate,
        }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["appointments-day-timeline", date],
      });
    },
  });
}