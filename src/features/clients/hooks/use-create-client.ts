"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../services/clients.api";
import { toast } from "react-hot-toast"; //

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      // Invalida o cache para que a lista de clientes seja atualizada imediatamente
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      toast.success("Cliente cadastrado com sucesso!"); //
    },
    onError: (error: any) => {
      // Exibe mensagens de erro do backend (ex: "E-mail já cadastrado")
      toast.error(error.message || "Erro ao cadastrar cliente");
    }
  });
}