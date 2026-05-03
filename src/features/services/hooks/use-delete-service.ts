"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteService } from "../api/delete-service"
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";


export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      // Invalida o cache para a lista de serviços atualizar sozinha
      queryClient.invalidateQueries({ queryKey: ["services"] });
      
      toast.success("Serviço deletado com sucesso!"); //
    },
    onError: (error: unknown) => {
              const errorMessage = extractErrorMessage(error, "Erro ao deletar serviço");
              toast.error(errorMessage);
            },
  });
}