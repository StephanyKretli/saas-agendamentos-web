"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBlockedDate } from "../api/create-blocked-date"
import { CreateBlockedDateInput } from "../types/blocked-date"
import { toast } from "react-hot-toast"
import { extractErrorMessage } from "@/lib/error-utils";

export function useCreateBlockedDate(professionalId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    // 🌟 Repassamos o professionalId para a API
    mutationFn: (data: CreateBlockedDateInput) => createBlockedDate(data, professionalId),
    onSuccess: () => {
      // 🌟 Atualizamos apenas a lista deste profissional específico
      queryClient.invalidateQueries({ queryKey: ["blocked-dates", professionalId] })
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] })
      toast.success("Dia bloqueado com sucesso!")
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao bloquear dia");
      toast.error(errorMessage);
    },
  })
}