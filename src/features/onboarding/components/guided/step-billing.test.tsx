import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepBilling } from "./step-billing";

// Preenche o form inteiro com dados válidos, exceto os overrides passados.
async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<{
    document: string;
    cardHolderName: string;
    cardNumber: string;
    cardExpiryMonth: string;
    cardExpiryYear: string;
    cardCcv: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  }> = {},
) {
  const values = {
    document: "529.982.247-25",
    cardHolderName: "MARIA DA SILVA",
    cardNumber: "5555555555554444",
    cardExpiryMonth: "12",
    cardExpiryYear: "2030",
    cardCcv: "123",
    postalCode: "01310100",
    addressNumber: "1000",
    phone: "11999999999",
    ...overrides,
  };

  if (values.document) await user.type(screen.getByPlaceholderText("000.000.000-00"), values.document);
  if (values.cardHolderName)
    await user.type(screen.getByPlaceholderText("Nome impresso no cartão"), values.cardHolderName);
  if (values.cardNumber) await user.type(screen.getByPlaceholderText("Número do cartão"), values.cardNumber);
  if (values.cardExpiryMonth) await user.selectOptions(screen.getByRole("combobox"), values.cardExpiryMonth);
  if (values.cardExpiryYear) await user.type(screen.getByPlaceholderText("AA"), values.cardExpiryYear);
  if (values.cardCcv) await user.type(screen.getByPlaceholderText("CVV"), values.cardCcv);
  if (values.postalCode) await user.type(screen.getByPlaceholderText("CEP"), values.postalCode);
  if (values.addressNumber) await user.type(screen.getByPlaceholderText("Número"), values.addressNumber);
  if (values.phone) await user.type(screen.getByPlaceholderText("WhatsApp (11) 99999-9999"), values.phone);
}

const noop = () => {};

describe("StepBilling", () => {
  it("botão SEMPRE habilitado — nunca fica desabilitado em silêncio, mesmo com o form vazio", () => {
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={noop} />,
    );
    const button = screen.getByRole("button", { name: /confirmar e ir para o painel/i });
    expect(button).not.toBeDisabled();
  });

  it("todos os campos válidos → clique dispara onContinue com os dígitos normalizados", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    await waitFor(() => expect(onContinue).toHaveBeenCalledTimes(1));
    expect(onContinue).toHaveBeenCalledWith({
      document: "52998224725",
      cardHolderName: "MARIA DA SILVA",
      cardNumber: "5555555555554444",
      cardExpiryMonth: "12",
      cardExpiryYear: "2030",
      cardCcv: "123",
      postalCode: "01310100",
      addressNumber: "1000",
      phone: "11999999999",
    });
  });

  it("CPF com máscara digitada pela pessoa é aceito (não precisa digitar só números)", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user); // já digita com a máscara aplicada pelo próprio input
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    await waitFor(() => expect(onContinue).toHaveBeenCalledTimes(1));
  });

  it("CPF com dígito verificador errado → clique mostra erro no campo e NÃO dispara submit", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user, { document: "529.982.247-26" }); // dígito verificador errado
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    expect(await screen.findByText(/cpf ou cnpj inválido/i)).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("cartão com número inválido → clique mostra erro no campo e NÃO dispara submit", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user, { cardNumber: "4111111111111112" }); // falha no Luhn
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    expect(await screen.findByText(/número do cartão inválido/i)).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("ano de validade com 2 dígitos (jeito que o cartão físico mostra) → ACEITO, payload sai normalizado pra 4 dígitos", async () => {
    // Inverte o teste anterior: exigir 4 dígitos e só EXPLICAR isso ainda
    // era pedir que a pessoa traduzisse "30" pra "2030" de cabeça. Agora o
    // software normaliza sozinho — só na hora de montar o payload.
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user, { cardExpiryYear: "30" });
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    await waitFor(() => expect(onContinue).toHaveBeenCalledTimes(1));
    expect(onContinue.mock.calls[0][0]).toMatchObject({ cardExpiryYear: "2030" });
  });

  it("ano de validade com 4 dígitos → aceito, payload mantém 2030", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user, { cardExpiryYear: "2030" });
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    await waitFor(() => expect(onContinue).toHaveBeenCalledTimes(1));
    expect(onContinue.mock.calls[0][0]).toMatchObject({ cardExpiryYear: "2030" });
  });

  it("ano de validade com 1 ou 3 dígitos → erro, não é nem formato de cartão nem por extenso", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user, { cardExpiryYear: "3" });
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    expect(await screen.findByText(/ano de validade inválido/i)).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("campo obrigatório vazio (nome do titular) → clique mostra erro nele e foca esse campo", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    await fillValidForm(user, { cardHolderName: "" }); // deixa vazio
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    const holderInput = screen.getByPlaceholderText("Nome impresso no cartão");
    await waitFor(() => expect(holderInput).toHaveFocus());
    expect(screen.getByText(/digite o nome impresso no cartão/i)).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("mais de um campo inválido → foca o PRIMEIRO na ordem visual da tela (CPF vem antes do cartão)", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={onContinue} />,
    );

    // document E cardNumber inválidos ao mesmo tempo — document vem primeiro na tela.
    await fillValidForm(user, { document: "111.111.111-11", cardNumber: "4111111111111112" });
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    const documentInput = screen.getByPlaceholderText("000.000.000-00");
    await waitFor(() => expect(documentInput).toHaveFocus());
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("corrigir um campo com erro apaga a mensagem dele ao digitar de novo", async () => {
    const user = userEvent.setup();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={noop} />,
    );

    await fillValidForm(user, { cardExpiryYear: "3" }); // 1 dígito: inválido
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));
    expect(await screen.findByText(/ano de validade inválido/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("AA"), "0"); // completa pra "30" — válido
    expect(screen.queryByText(/ano de validade inválido/i)).not.toBeInTheDocument();
  });

  it("botão nunca fica desabilitado sem mensagem visível: em todo estado de erro, ou o botão está habilitado, ou há texto de erro na tela", async () => {
    const user = userEvent.setup();
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={noop} />,
    );

    // Form vazio, clique imediato.
    await user.click(screen.getByRole("button", { name: /confirmar e ir para o painel/i }));

    const button = screen.getByRole("button", { name: /confirmar e ir para o painel/i });
    const hasVisibleErrorText = screen.getAllByText(/inválid|digite|selecione|informe/i).length > 0;
    expect(!button.hasAttribute("disabled") || hasVisibleErrorText).toBe(true);
  });

  it("copy mostra a data real de trialEndsAt formatada dd/MM, sem recalcular hoje+14", () => {
    render(
      <StepBilling saving={false} serverError={null} trialEndsAt="2026-09-25T15:00:00.000Z" onContinue={noop} />,
    );
    expect(screen.getByText("25/09")).toBeInTheDocument();
  });

  it("sem trialEndsAt disponível: mostra carregando, nunca inventa uma data", () => {
    render(<StepBilling saving={false} serverError={null} trialEndsAt={null} onContinue={noop} />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    expect(screen.queryByText(/primeira cobrança/i)).not.toBeInTheDocument();
  });
});
