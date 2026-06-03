"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
// 🌟 CORRIGIDO: Importa a rota pública (sem auth headers)
import { cancelAppointmentByToken } from "../api/cancel-appointment";

export function useCancelAppointment(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tokenToCancel: string) => {
      return cancelAppointmentByToken(tokenToCancel);
    },
    onSuccess: async () => {
      // 🌟 Atualiza o card de preview para o estado "Cancelado"
      await queryClient.invalidateQueries({
        queryKey: ["public-cancel-preview", token],
      });
    },
  });
}