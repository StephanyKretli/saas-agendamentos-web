"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessHour } from "../services/business-hours.api";

export function useDeleteBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBusinessHour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
    },
  });
}