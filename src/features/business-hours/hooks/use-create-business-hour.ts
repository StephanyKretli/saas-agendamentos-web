"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessHour } from "../services/business-hours.api";
import { toast } from "react-hot-toast"; //

export function useCreateBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusinessHour,
    onSuccess: () => {
      // Atualiza a lista de horários de funcionamento no painel
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      
      // Invalida a disponibilidade pública para refletir os novos horários
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });

      toast.success("Horário de funcionamento criado!"); //
    },
    onError: (error: any) => {
      // Exibe mensagens de erro (ex: "Este dia da semana já possui um horário")
      toast.error(error.message || "Erro ao criar horário");
    }
  });
}