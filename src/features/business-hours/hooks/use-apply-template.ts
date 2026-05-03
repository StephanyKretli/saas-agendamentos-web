"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyBusinessHoursTemplate } from "../services/business-hours.api"; // Ajuste o caminho se necessário
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "@/lib/error-utils";


export function useApplyBusinessHoursTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    // Envolva em uma função que recebe o payload e repassa para a sua função da API
    mutationFn: (variables: { sourceWeekday: number; targetWeekdays: number[]; replace?: boolean }) => 
      applyBusinessHoursTemplate(variables), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      toast.success("Horários copiados com sucesso!");
    },
    onError: (error: unknown) => {
    
      const errorMessage = extractErrorMessage(error, "Erro ao copiar horários");
      
      toast.error(errorMessage);
    }
  });
}