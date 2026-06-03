"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
// 🌟 Caminho relativo aqui também!
import { deleteService } from "../services/services.api";
import { toast } from "react-hot-toast";

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      toast.success("Serviço apagado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao apagar o serviço.");
    },
  });
}