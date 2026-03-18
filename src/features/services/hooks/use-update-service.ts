"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService, UpdateServiceInput } from "../api/update-service";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceInput) => updateService(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.services,
      });

      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });
    },
  });
}