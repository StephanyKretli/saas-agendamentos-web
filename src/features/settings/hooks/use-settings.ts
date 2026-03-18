"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/auth-storage";
import { getSettings, updateSettings } from "../services/settings.service";
import type { UpdateSettingsInput } from "../types/settings.types";

export function useSettingsQuery() {
  const token = getAccessToken();

  return useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(token as string),
    enabled: !!token,
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  const token = getAccessToken();

  return useMutation({
    mutationFn: (input: UpdateSettingsInput) =>
      updateSettings(token as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}