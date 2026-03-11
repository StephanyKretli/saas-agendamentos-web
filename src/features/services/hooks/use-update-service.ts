"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateService, UpdateServiceInput } from "../api/update-service"

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateServiceInput) => updateService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      })
    },
  })
}