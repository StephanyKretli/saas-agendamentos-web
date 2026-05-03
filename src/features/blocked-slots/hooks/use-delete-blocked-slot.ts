"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlockedSlot } from "../api/delete-blocked-slot";
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";


export function useDeleteBlockedSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlockedSlot(id),
    onSuccess: async () => {
      // Atualiza a lista de bloqueios no painel administrativo
      await queryClient.invalidateQueries({
        queryKey: ["blocked-slots"],
      });

      // MUITO IMPORTANTE: Invalida a disponibilidade pública para liberar
      // esses horários para os clientes imediatamente
      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Bloqueio removido com sucesso!"); //
    },
    onError: (error: unknown) => {
          const errorMessage = extractErrorMessage(error, "Erro ao remover bloqueio");
          toast.error(errorMessage);
        },
  });
}