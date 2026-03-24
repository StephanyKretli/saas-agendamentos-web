"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyBusinessHoursTemplate } from "../services/business-hours.api"; // Ajuste o caminho se necessário
import { toast } from "react-hot-toast";

export function useApplyBusinessHoursTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyBusinessHoursTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      toast.success("Horários copiados com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao copiar horários");
    }
  });
}