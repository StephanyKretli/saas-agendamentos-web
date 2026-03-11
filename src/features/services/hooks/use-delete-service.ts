"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteService } from "../services/services.api"

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}