"use client";

import { useState } from "react";
import { useCreateClient } from "../hooks/use-create-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const createClient = useCreateClient();

  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Tratamos campos opcionais enviando 'undefined' se estiverem vazios,
    // assim o backend (NestJS) ignora e não salva strings vazias no banco.
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      await createClient.mutateAsync(payload);
      
      // Se deu sucesso (201), avisa a página para fechar o modal
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  }

  const isPending = createClient.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Nome completo *
        </label>
        <Input
          placeholder="Ex.: João da Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Telefone / WhatsApp *
        </label>
        <Input
          type="tel"
          placeholder="Ex.: (11) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          E-mail <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <Input
          type="email"
          placeholder="Ex.: joao@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Observações <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        {/* Usando um textarea simples para anotações, mas com o visual do ShadcnUI */}
        <textarea
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ex.: Alérgico a produto X, prefere horários na parte da manhã..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}