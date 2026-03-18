"use client";

import * as React from "react";
import { useSettingsQuery, useUpdateSettingsMutation } from "@/features/settings/hooks/use-settings";
import { useUploadAvatar } from "@/features/settings/hooks/use-upload-avatar";

type FormState = {
  name: string;
  username: string;
  timezone: string;
  bufferMinutes: string;
  minBookingNoticeMinutes: string;
  maxBookingDays: string;
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

export default function SettingsPage() {
  const { data, isLoading, isError, error } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const uploadAvatarMutation = useUploadAvatar();

  const [form, setForm] = React.useState<FormState>({
    name: "",
    username: "",
    timezone: "America/Sao_Paulo",
    bufferMinutes: "0",
    minBookingNoticeMinutes: "0",
    maxBookingDays: "30",
  });

  const [successMessage, setSuccessMessage] = React.useState("");
  const [avatarSuccessMessage, setAvatarSuccessMessage] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!data) return;

    setForm({
      name: data.name ?? "",
      username: data.username ?? "",
      timezone: data.timezone ?? "America/Sao_Paulo",
      bufferMinutes: String(data.bufferMinutes ?? 0),
      minBookingNoticeMinutes: String(data.minBookingNoticeMinutes ?? 0),
      maxBookingDays: String(data.maxBookingDays ?? 30),
    });
  }, [data]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSuccessMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");

    await updateMutation.mutateAsync({
      name: form.name.trim(),
      username: form.username.trim(),
      timezone: form.timezone,
      bufferMinutes: Number(form.bufferMinutes || 0),
      minBookingNoticeMinutes: Number(form.minBookingNoticeMinutes || 0),
      maxBookingDays: Number(form.maxBookingDays || 0),
    });

    setSuccessMessage("Configurações salvas com sucesso.");
  }

  async function handleAvatarUpload() {
    if (!selectedFile) return;

    setAvatarSuccessMessage("");
    await uploadAvatarMutation.mutateAsync(selectedFile);
    setAvatarSuccessMessage("Foto de perfil atualizada com sucesso.");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  if (isLoading) {
    return <div>Carregando configurações...</div>;
  }

  if (isError) {
    return (
      <div>
        Erro ao carregar configurações.
        {" "}
        {error instanceof Error ? error.message : ""}
      </div>
    );
  }

  const avatarPreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : data?.avatarUrl ?? null;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Ajuste seus dados e personalize seu perfil profissional.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Foto de perfil"
                className="h-20 w-20 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted text-xl font-semibold text-foreground">
                {getInitial(data?.name)}
              </div>
            )}

            <div>
              <h2 className="text-base font-semibold text-foreground">
                Foto de perfil
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Envie uma imagem JPG, PNG ou WEBP de até 2MB.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:ml-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
                setAvatarSuccessMessage("");
              }}
              className="text-sm"
            />

            <button
              type="button"
              onClick={() => void handleAvatarUpload()}
              disabled={!selectedFile || uploadAvatarMutation.isPending}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadAvatarMutation.isPending
                ? "Enviando foto..."
                : "Salvar foto"}
            </button>
          </div>
        </div>

        {uploadAvatarMutation.isError ? (
          <p className="mt-4 text-sm text-red-600">
            {uploadAvatarMutation.error instanceof Error
              ? uploadAvatarMutation.error.message
              : "Erro ao enviar imagem."}
          </p>
        ) : null}

        {avatarSuccessMessage ? (
          <p className="mt-4 text-sm text-green-600">
            {avatarSuccessMessage}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Dados da conta
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajuste seu nome, username e regras de agendamento.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="America/Sao_Paulo">São Paulo</option>
                <option value="America/Manaus">Manaus</option>
                <option value="America/Recife">Recife</option>
                <option value="America/Fortaleza">Fortaleza</option>
                <option value="America/Rio_Branco">Rio Branco</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="bufferMinutes" className="text-sm font-medium">
                Buffer entre agendamentos (min)
              </label>
              <input
                id="bufferMinutes"
                name="bufferMinutes"
                type="number"
                min={0}
                value={form.bufferMinutes}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="minBookingNoticeMinutes"
                className="text-sm font-medium"
              >
                Antecedência mínima (min)
              </label>
              <input
                id="minBookingNoticeMinutes"
                name="minBookingNoticeMinutes"
                type="number"
                min={0}
                value={form.minBookingNoticeMinutes}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="maxBookingDays" className="text-sm font-medium">
                Máximo de dias no futuro
              </label>
              <input
                id="maxBookingDays"
                name="maxBookingDays"
                type="number"
                min={0}
                value={form.maxBookingDays}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {updateMutation.isError ? (
            <p className="text-sm text-red-600">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Erro ao salvar configurações."}
            </p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-green-600">{successMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending
              ? "Salvando configurações..."
              : "Salvar configurações"}
          </button>
        </form>
      </section>
    </div>
  );
}