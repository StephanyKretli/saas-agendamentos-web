"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlockedSlot } from "../api/delete-blocked-slot";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "@/lib/error-utils";

// 🌟 Sem pedir parâmetros aqui dentro dos parênteses!
export function useDeleteBlockedSlot() {
  const queryClient = useQueryClient();

  // 🌟 Usando useMutation para ações (criar, editar, apagar)
  return useMutation({
    mutationFn: (id: string) => deleteBlockedSlot(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["blocked-slots"] });
      await queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      
      toast.success("Bloqueio removido com sucesso!"); 
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao remover bloqueio");
      toast.error(errorMessage);
    },
  });
}