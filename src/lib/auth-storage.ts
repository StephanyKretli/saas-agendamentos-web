const ACCESS_TOKEN_KEY = "saas-agendamentos:access-token";

export function saveAccessToken(token: string) {
  if (typeof window === "undefined") return;
  
  // Salva no navegador (para os componentes React)
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  
  // Salva nos Cookies (para o Middleware deixar você entrar!)
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}