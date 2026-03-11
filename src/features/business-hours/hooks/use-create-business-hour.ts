"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessHour } from "../services/business-hours.api";

export function useCreateBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusinessHour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
    },
  });
}