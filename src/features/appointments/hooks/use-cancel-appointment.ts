"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAppointment } from "../services/appointments.api";

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}