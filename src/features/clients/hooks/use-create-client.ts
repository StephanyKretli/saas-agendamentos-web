"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../services/clients.api";
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";


export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      // Invalida o cache para que a lista de clientes seja atualizada imediatamente
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      toast.success("Cliente cadastrado com sucesso!"); //
    },
    onError: (error: unknown) => {
          const errorMessage = extractErrorMessage(error, "Erro ao cadastrar cliente");
          toast.error(errorMessage);
        },
  });
}