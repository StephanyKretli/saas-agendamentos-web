"use client";

import { useQuery } from "@tanstack/react-query";
import { getCancelPreview } from "../api/get-cancel-preview";

export function useCancelPreview(token: string) {
  return useQuery({
    queryKey: ["public-cancel-preview", token],
    queryFn: () => getCancelPreview(token),
    enabled: Boolean(token),
    retry: false,
  });
}