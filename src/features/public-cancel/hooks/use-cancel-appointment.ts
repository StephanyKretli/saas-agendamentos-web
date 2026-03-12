"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAppointmentByToken } from "../api/cancel-appointment";

export function useCancelAppointment(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelAppointmentByToken(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["public-cancel-preview", token],
      });
    },
  });
}