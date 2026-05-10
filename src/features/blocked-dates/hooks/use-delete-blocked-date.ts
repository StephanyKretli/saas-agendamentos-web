"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBlockedDate } from "../api/delete-blocked-date"
import { toast } from "react-hot-toast"
import { extractErrorMessage } from "@/lib/error-utils";

export function useDeleteBlockedDate(professionalId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlockedDate(id),
    onSuccess: () => {
      // 🌟 Atualizamos apenas a lista deste profissional específico
      queryClient.invalidateQueries({ queryKey: ["blocked-dates", professionalId] })
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] })
      toast.success("Bloqueio removido com sucesso!")
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao remover bloqueio");
      toast.error(errorMessage);
    },
  })
}