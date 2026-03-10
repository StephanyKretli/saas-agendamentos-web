const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

type RequestOptions = RequestInit;

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Erro ao realizar requisição";

    try {
      const errorBody = await response.json();
      message = errorBody.message ?? message;
    } catch {
      // mantém mensagem padrão
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}