const ACCESS_TOKEN_KEY = "saas-agendamentos:access-token";

/**
 * O token era gravado tambem em document.cookie "para o Middleware deixar
 * voce entrar" — mas nao existe middleware.ts neste projeto. Era um cookie
 * que ninguem lia, sem HttpOnly (impossivel via JS) e sem Secure, ou seja:
 * uma segunda copia do token acessivel a qualquer XSS, sem nenhum ganho.
 *
 * A protecao de rota real acontece em src/app/(dashboard)/layout.tsx.
 *
 * Proximo passo recomendado (nao feito aqui por exigir mudanca no backend):
 * o backend setar um cookie HttpOnly + Secure e o front parar de manipular
 * o token em JavaScript.
 */
export function saveAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // Limpa o cookie legado, caso ainda exista de uma sessao anterior.
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
