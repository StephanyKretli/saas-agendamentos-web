"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlockedSlot } from "../api/delete-blocked-slot";
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";

// 🌟 1. Aceita o professionalId para podermos limpar o cache exato
export function useDeleteBlockedSlot(professionalId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // Na deleção, a API geralmente só precisa do ID do bloqueio em si
    mutationFn: (id: string) => deleteBlockedSlot(id),
    onSuccess: async () => {
      // 🌟 2. Atualiza apenas a lista do profissional
      await queryClient.invalidateQueries({
        queryKey: ["blocked-slots", professionalId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Bloqueio removido com sucesso!"); 
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao remover bloqueio");
      toast.error(errorMessage);
    },
  });
}