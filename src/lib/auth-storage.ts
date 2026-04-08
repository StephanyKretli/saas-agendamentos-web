const ACCESS_TOKEN_KEY = "saas-agendamentos:access-token";

export function saveAccessToken(token: string) {
  if (typeof window === "undefined") return;
  
  // 1. Salva no localStorage (como já fazia)
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  
  // 2. Salva nos Cookies para o Middleware (Servidor) deixar você entrar!
  // Configurado para durar 7 dias (604800 segundos) e estar disponível em todo o site (path=/)
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  if (typeof window === "undefined") return;
  
  // Apaga do localStorage
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  
  // Apaga dos Cookies (Isso é importante para o botão de Logout funcionar direito)
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}