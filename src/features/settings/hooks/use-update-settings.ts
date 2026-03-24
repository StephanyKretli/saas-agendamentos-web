"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "../api/settings.api";
import { toast } from "react-hot-toast";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configurações guardadas com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao guardar configurações.");
    },
  });
}