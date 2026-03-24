"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteService } from "../api/delete-service"
import { toast } from "react-hot-toast"; //

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      // Invalida o cache para a lista de serviços atualizar sozinha
      queryClient.invalidateQueries({ queryKey: ["services"] });
      
      toast.success("Serviço deletado com sucesso!"); //
    },
    onError: (error: any) => {
      // Exibe a mensagem de erro vinda da sua API (ex: "Nome já existe")
      toast.error(error.message || "Erro ao deletar serviço");
    }
  });
}