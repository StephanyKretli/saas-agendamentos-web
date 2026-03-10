"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeAppointment } from "../services/appointments.api";

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}