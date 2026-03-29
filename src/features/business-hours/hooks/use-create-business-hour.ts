"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessHour } from "../services/business-hours.api";
import { toast } from "react-hot-toast";

// 🌟 Recebe o ID do profissional
export function useCreateBusinessHour(professionalId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // 🌟 Repassa o payload e o ID para a API
    mutationFn: (payload: any) => createBusinessHour(payload, professionalId),
    onSuccess: () => {
      // 🌟 Atualiza APENAS a tela do profissional que estamos a editar
      queryClient.invalidateQueries({ queryKey: ["business-hours", professionalId] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });

      toast.success("Horário de funcionamento criado!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar horário");
    }
  });
}