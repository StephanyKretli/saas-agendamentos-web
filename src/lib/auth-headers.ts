import { getAccessToken } from "./auth-storage";

export function getAuthHeaders() {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}