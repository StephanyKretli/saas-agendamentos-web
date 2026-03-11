"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteService } from "../api/delete-service"

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      })
    },
  })
}