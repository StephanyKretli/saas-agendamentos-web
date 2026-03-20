"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export function useCancelAppointment(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return api.patch(`/appointments/${appointmentId}/cancel`, {}, {
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