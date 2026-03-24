"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessHour } from "../services/business-hours.api"; // Ajuste o caminho se necessário
import { toast } from "react-hot-toast";

export function useDeleteBusinessHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBusinessHour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      toast.success("Horário removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover horário");
    }
  });
}