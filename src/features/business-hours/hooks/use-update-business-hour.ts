"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessHour } from "../services/business-hours.api";
import { toast } from "react-hot-toast";

export function useUpdateBusinessHour(professionalId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      updateBusinessHour(id, payload, professionalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours", professionalId] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      
      toast.success("Horário atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar horário");
    }
  });
}