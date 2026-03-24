"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAppointmentByToken } from "../api/cancel-appointment";
import { toast } from "react-hot-toast";

export function useCancelAppointment(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // Usa a função correta da API passando o token
    mutationFn: () => cancelAppointmentByToken(token),
    onSuccess: async () => {
      // Invalida a query do preview para atualizar o status para "CANCELED" na tela
      await queryClient.invalidateQueries({
        queryKey: ["public-cancel-preview", token],
      });

      // Atualiza o calendário público (libera o horário) e o dashboard do profissional
      await queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      toast.success("Agendamento cancelado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao cancelar o agendamento.");
    }
  });
}