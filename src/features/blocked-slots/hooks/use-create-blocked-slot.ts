"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlockedSlot } from "../api/create-blocked-slot";
import type { CreateBlockedSlotInput } from "../types/blocked-slot";
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";


export function useCreateBlockedSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlockedSlotInput) => createBlockedSlot(data),
    onSuccess: async () => {
      // Atualiza a lista de bloqueios no painel administrativo
      await queryClient.invalidateQueries({
        queryKey: ["blocked-slots"],
      });

      // MUITO IMPORTANTE: Invalida a disponibilidade pública para remover 
      // esses horários da visão do cliente final imediatamente
      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Horário bloqueado com sucesso!"); //
    },
    onError: (error: unknown) => {
          const errorMessage = extractErrorMessage(error, "Erro ao bloquear horário");
          toast.error(errorMessage);
        },
  });
}