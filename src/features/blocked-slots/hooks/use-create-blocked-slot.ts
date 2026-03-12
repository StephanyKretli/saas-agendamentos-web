"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlockedSlot } from "../api/create-blocked-slot";
import type { CreateBlockedSlotInput } from "../types/blocked-slot";

export function useCreateBlockedSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlockedSlotInput) => createBlockedSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blocked-slots"],
      });
    },
  });
}