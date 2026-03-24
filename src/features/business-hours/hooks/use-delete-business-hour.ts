"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessHour } from "../services/business-hours.api";
import { toast } from "react-hot-toast"; //

export function useDeleteBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBusinessHour,
    onSuccess: () => {
      // Atualiza a lista de horários no painel administrativo
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      
      // Invalida a disponibilidade pública, pois remover um horário de 
      // funcionamento retira opções de agendamento para os clientes
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });

      toast.success("Horário removido com sucesso!"); //
    },
    onError: (error: any) => {
      // Exibe o erro caso o backend impeça a exclusão
      toast.error(error.message || "Erro ao remover horário");
    }
  });
}