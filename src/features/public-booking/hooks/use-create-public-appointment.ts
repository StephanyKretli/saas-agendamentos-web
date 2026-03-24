"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPublicAppointment } from "../services/public-booking.api";
import type { CreatePublicAppointmentPayload } from "../types/public-booking.types";
import { toast } from "react-hot-toast"; //

type MutationParams = {
  username: string;
  payload: CreatePublicAppointmentPayload;
};

export function useCreatePublicAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, payload }: MutationParams) =>
      createPublicAppointment({ username, payload }),
    
    onSuccess: () => {
      // Invalida a disponibilidade para que o horário que acabou de ser ocupado suma da lista
      queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Agendamento realizado com sucesso!"); //
    },
    
    onError: (error: any) => {
      // Exibe a mensagem de erro (ex: "Este horário já foi preenchido")
      toast.error(error.message || "Não foi possível concluir o agendamento."); //
    },
  });
}