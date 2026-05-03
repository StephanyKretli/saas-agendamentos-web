"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessHour } from "../services/business-hours.api";
import { toast } from "react-hot-toast";
// 🌟 1. Importa o nosso extrator de erros
import { extractErrorMessage } from "@/lib/error-utils";

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
    onError: (error: unknown) => {
      // 🌟 2. O PASSO 2 ENTRA AQUI! 
      // Passamos o erro bruto e uma mensagem de fallback caso o servidor não responda
      const errorMessage = extractErrorMessage(error, "Erro ao criar horário");
      
      // O toast agora vai mostrar a mensagem exata que veio do NestJS!
      toast.error(errorMessage);
    }
  });
}