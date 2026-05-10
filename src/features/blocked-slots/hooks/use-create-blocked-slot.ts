"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlockedSlot } from "../api/create-blocked-slot";
import type { CreateBlockedSlotInput } from "../types/blocked-slot";
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";

// 🌟 1. Aceita o professionalId
export function useCreateBlockedSlot(professionalId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // 🌟 2. Repassa o payload e o ID do profissional para a API
    mutationFn: (data: CreateBlockedSlotInput) => createBlockedSlot(data, professionalId),
    onSuccess: async () => {
      // 🌟 3. Atualiza apenas a lista do profissional que sofreu a alteração
      await queryClient.invalidateQueries({
        queryKey: ["blocked-slots", professionalId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Horário bloqueado com sucesso!"); 
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao bloquear horário");
      toast.error(errorMessage);
    },
  });
}