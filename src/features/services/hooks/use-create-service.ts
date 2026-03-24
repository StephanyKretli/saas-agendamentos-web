"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService } from "../services/services.api"; 
import { toast } from "react-hot-toast"; //

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // Invalida o cache para a lista de serviços atualizar sozinha
      queryClient.invalidateQueries({ queryKey: ["services"] });
      
      toast.success("Serviço criado com sucesso!"); //
    },
    onError: (error: any) => {
      // Exibe a mensagem de erro vinda da sua API (ex: "Nome já existe")
      toast.error(error.message || "Erro ao criar serviço");
    }
  });
}