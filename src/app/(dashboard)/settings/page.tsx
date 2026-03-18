"use client";

import * as React from "react";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/features/settings/hooks/use-settings";

export default function SettingsPage() {
  const { data, isLoading, isError } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const [form, setForm] = React.useState({
    name: "",
    username: "",
    timezone: "America/Sao_Paulo",
    bufferMinutes: "0",
    minBookingNoticeMinutes: "0",
    maxBookingDays: "30",
  });

  const [success, setSuccess] = React.useState("");

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
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await updateMutation.mutateAsync({
      name: form.name.trim(),
      username: form.username.trim(),
      timezone: form.timezone,
      bufferMinutes: Number(form.bufferMinutes || 0),
      minBookingNoticeMinutes: Number(form.minBookingNoticeMinutes || 0),
      maxBookingDays: Number(form.maxBookingDays || 0),
    });

    setSuccess("Configurações salvas com sucesso.");
  }

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar configurações</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Configurações</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" />

        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />

        <select name="timezone" value={form.timezone} onChange={handleChange}>
          <option value="America/Sao_Paulo">São Paulo</option>
          <option value="America/Manaus">Manaus</option>
          <option value="America/Recife">Recife</option>
        </select>

        <input name="bufferMinutes" type="number" min={0} value={form.bufferMinutes} onChange={handleChange} />

        <input name="minBookingNoticeMinutes" type="number" min={0} value={form.minBookingNoticeMinutes} onChange={handleChange} />

        <input name="maxBookingDays" type="number" min={0} value={form.maxBookingDays} onChange={handleChange} />

        <button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Salvando..." : "Salvar"}
        </button>

        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
}