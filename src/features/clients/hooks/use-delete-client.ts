"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "../services/clients.api"; // Verifique se o caminho da sua API está correto
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "@/lib/error-utils";


export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: async () => {
      // Invalida o cache de clientes para forçar a atualização da lista na tela
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      toast.success("Cliente removido com sucesso!");
    },
    onError: (error: unknown) => {
          const errorMessage = extractErrorMessage(error, "Erro ao remover cliente");
          toast.error(errorMessage);
        },
  });
}