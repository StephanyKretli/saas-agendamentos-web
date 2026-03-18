"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadServiceImage } from "../services/upload-service-image.service";

export function useUploadServiceImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      file,
    }: {
      serviceId: string;
      file: File;
    }) => uploadServiceImage(serviceId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });
    },
  });
}