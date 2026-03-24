"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "react-hot-toast"; //

export function useCompleteAppointment(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return api.patch(`/appointments/${appointmentId}/complete`, {}, {
        headers: getAuthHeaders(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(date), //
      });

      toast.success("Agendamento realizado com sucesso!"); //
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao efetuar agendamento"); //
    },
  });
}