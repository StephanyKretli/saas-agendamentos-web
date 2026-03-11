"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateService } from "../services/services.api"

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: any
    }) => updateService(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}