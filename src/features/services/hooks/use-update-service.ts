"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService, UpdateServiceInput } from "../api/update-service";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "react-hot-toast"; //

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceInput) => updateService(data),
    onSuccess: async () => {
      // Atualiza a lista de serviços no painel
      await queryClient.invalidateQueries({
        queryKey: queryKeys.services,
      });

      // Invalida a disponibilidade pública, pois mudanças no serviço (ex: duração)
      // alteram os horários disponíveis para os clientes
      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Serviço atualizado com sucesso!"); //
    },
    onError: (error: any) => {
      // Exibe o erro tratado pelo seu interceptor (ex: "Serviço não encontrado")
      toast.error(error.message || "Erro ao atualizar o serviço");
    }
  });
}