"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { queryKeys } from "@/lib/query-keys";

export function useCompleteAppointment(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return apiFetch(`/appointments/${appointmentId}/complete`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(date),
      });

      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });
    },
  });
}