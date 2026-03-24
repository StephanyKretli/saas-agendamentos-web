"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBlockedDate } from "../api/create-blocked-date"
import { CreateBlockedDateInput } from "../types/blocked-date"
import { toast } from "react-hot-toast"

export function useCreateBlockedDate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlockedDateInput) => createBlockedDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-dates"] })
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] })
      toast.success("Dia bloqueado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao bloquear dia")
    }
  })
}