import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { UserSettings, UpdateSettingsPayload } from "../types/settings.types";

export async function getSettings(): Promise<UserSettings> {
  return api.get("/settings", {
    headers: getAuthHeaders(),
  }) as Promise<UserSettings>;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<UserSettings> {
  return api.patch("/settings", payload, {
    headers: getAuthHeaders(),
  }) as Promise<UserSettings>;
}

export async function uploadAvatar(file: File): Promise<UserSettings> {
  const formData = new FormData();
  formData.append("file", file);

  return api.patch("/settings/avatar", formData, {
    headers: {
      ...getAuthHeaders(),
    },
  }) as Promise<UserSettings>;
}