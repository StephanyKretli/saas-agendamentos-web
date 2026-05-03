import { isAxiosError } from "axios";

/**
 * Abre o erro da API e extrai o motivo exato retornado pelo backend.
 */
export function extractErrorMessage(error: unknown, defaultMessage = "Ocorreu um erro inesperado."): string {
  // 1. Verifica se a falha veio da nossa API (via Axios)
  if (isAxiosError(error)) {
    // É aqui que o NestJS guarda o motivo do erro!
    const backendMessage = error.response?.data?.message;

    // Cenário A: Erro de Validação (class-validator do NestJS)
    // Ex: ["O nome é obrigatório", "O email deve ser válido"]
    if (Array.isArray(backendMessage) && backendMessage.length > 0) {
      return backendMessage[0]; // Devolvemos o primeiro motivo da lista
    }

    // Cenário B: Erro de Regra de Negócio (BadRequestException, NotFoundException)
    // Ex: "O horário selecionado já está ocupado."
    if (typeof backendMessage === "string") {
      return backendMessage;
    }
  }

  // 2. Se for um erro de JavaScript no próprio navegador do cliente
  if (error instanceof Error) {
    return error.message;
  }

  // 3. Se a internet cair ou o servidor não responder, usamos o texto padrão
  return defaultMessage;
}