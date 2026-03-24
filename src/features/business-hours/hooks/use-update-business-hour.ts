"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessHour } from "../services/business-hours.api";
import type { UpdateBusinessHourPayload } from "../types/business-hours.types";
import { toast } from "react-hot-toast"; //

export function useUpdateBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBusinessHourPayload;
    }) => updateBusinessHour(id, payload),
    onSuccess: async () => {
      // Atualiza a lista no painel administrativo
      await queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      
      // MUITO IMPORTANTE: Invalida a disponibilidade pública para refletir a mudança de horários
      await queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });

      toast.success("Horário atualizado com sucesso!"); //
    },
    onError: (error: any) => {
      // Exibe a mensagem tratada pelo seu interceptor da api.ts
      toast.error(error.message || "Erro ao atualizar horário");
    }
  });
}