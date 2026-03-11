"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessHour } from "../services/business-hours.api";
import type { UpdateBusinessHourPayload } from "../types/business-hours.types";

export function useUpdateBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBusinessHourPayload;
    }) => updateBusinessHour(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
    },
  });
}