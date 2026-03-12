"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlockedSlot } from "../api/delete-blocked-slot";

export function useDeleteBlockedSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlockedSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blocked-slots"],
      });
    },
  });
}