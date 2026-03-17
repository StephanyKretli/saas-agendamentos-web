"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export function useCancelAppointment(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return apiFetch(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["appointments-day-timeline", date],
      });
    },
  });
}