"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBlockedDate } from "../api/create-blocked-date"
import { CreateBlockedDateInput } from "../types/blocked-date"

export function useCreateBlockedDate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlockedDateInput) => createBlockedDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blocked-dates"],
      })
    },
  })
}