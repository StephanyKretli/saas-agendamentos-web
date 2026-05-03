"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService } from "../services/services.api"; 
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";


export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // Invalida o cache para a lista de serviços atualizar sozinha
      queryClient.invalidateQueries({ queryKey: ["services"] });
      
      toast.success("Serviço criado com sucesso!"); //
    },
    onError: (error: unknown) => {
              const errorMessage = extractErrorMessage(error, "Erro ao criar serviço");
              toast.error(errorMessage);
            },
  });
}