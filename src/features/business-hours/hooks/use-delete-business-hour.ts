"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessHour } from "../services/business-hours.api";
import { toast } from "react-hot-toast";

export function useDeleteBusinessHour(professionalId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBusinessHour(id, professionalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours", professionalId] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      
      toast.success("Horário removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover horário");
    }
  });
}