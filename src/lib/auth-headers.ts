import { getAccessToken } from "./auth-storage";

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}