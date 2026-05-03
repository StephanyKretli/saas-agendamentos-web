"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "../api/settings.api";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "@/lib/error-utils";


export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Fotografia atualizada!");
    },
    onError: (error: unknown) => {
          const errorMessage = extractErrorMessage(error, "Erro ao enviar fotografia.");
          toast.error(errorMessage);
        },
  });
}