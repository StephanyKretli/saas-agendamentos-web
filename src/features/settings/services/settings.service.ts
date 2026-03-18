import { apiFetch } from "@/lib/api";
import type { Settings, UpdateSettingsInput } from "../types/settings.types";

export async function getSettings(token: string) {
  return apiFetch<Settings>("/settings", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateSettings(
  token: string,
  input: UpdateSettingsInput,
) {
  return apiFetch<Settings>("/settings", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}