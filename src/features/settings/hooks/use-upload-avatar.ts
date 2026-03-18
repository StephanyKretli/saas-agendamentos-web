"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "../services/upload-avatar.service";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}