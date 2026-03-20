import { api } from "@/lib/api";
import type { Settings, UpdateSettingsInput } from "../types/settings.types";

export async function getSettings(token: string): Promise<Settings> {
  return api.get("/settings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }) as Promise<Settings>;
}

export async function updateSettings(
  token: string,
  input: UpdateSettingsInput,
): Promise<Settings> {
  return api.patch("/settings", input, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }) as Promise<Settings>;
}