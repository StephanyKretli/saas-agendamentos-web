"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBlockedDate } from "../api/delete-blocked-date"

export function useDeleteBlockedDate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlockedDate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blocked-dates"],
      })
    },
  })
}