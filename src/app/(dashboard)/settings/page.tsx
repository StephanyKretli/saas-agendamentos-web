"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { useUploadAvatar } from "@/features/settings/hooks/use-upload-avatar";
import { Camera, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados dos formulários
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [bufferMinutes, setBufferMinutes] = useState(0);
  const [minBookingNotice, setMinBookingNotice] = useState(0);
  const [maxBookingDays, setMaxBookingDays] = useState(30);

  // Sincronizar dados quando a API responde
  useEffect(() => {
    if (settings) {
      setName(settings.name || "");
      setUsername(settings.username || "");
      setTimezone(settings.timezone || "America/Sao_Paulo");
      setBufferMinutes(settings.bufferMinutes || 0);
      setMinBookingNotice(settings.minBookingNoticeMinutes || 0);
      setMaxBookingDays(settings.maxBookingDays || 30);
    }
  }, [settings]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ name, username });
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      timezone,
      bufferMinutes: Number(bufferMinutes),
      minBookingNoticeMinutes: Number(minBookingNotice),
      maxBookingDays: Number(maxBookingDays),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  if (loadingSettings) {
    return <div className="p-8 text-center text-muted-foreground">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie o seu perfil e as regras da sua agenda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* SECÇÃO DE PERFIL */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Perfil Público</h2>
          <p className="text-sm text-muted-foreground mb-6">Como os clientes verão você.</p>

          <div className="flex items-center gap-5 mb-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
              {settings?.avatarUrl ? (
                <img src={settings.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">Sem foto</div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            
            <div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <Camera className="h-4 w-4" /> Alterar foto
              </button>
              <p className="mt-2 text-xs text-muted-foreground">JPG, PNG ou WEBP. Máx 2MB.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome Completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome de Utilizador (URL)</label>
              <div className="flex items-center">
                <span className="rounded-l-xl border border-r-0 border-input bg-muted px-3 py-2 text-sm text-muted-foreground">saas.com/</span>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-r-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" required />
              </div>
            </div>
            <button type="submit" disabled={isUpdating} className="w-full mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60 flex justify-center items-center gap-2">
              <Save className="h-4 w-4" /> {isUpdating ? "Salvando..." : "Salvar Perfil"}
            </button>
          </form>
        </section>

        {/* SECÇÃO DE REGRAS DE AGENDAMENTO */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Regras da Agenda</h2>
          <p className="text-sm text-muted-foreground mb-6">Defina os limites para marcações.</p>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fuso Horário</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="America/Sao_Paulo">America/Sao_Paulo (Brasília)</option>
                <option value="Europe/Lisbon">Europe/Lisbon (Portugal)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Intervalo entre serviços (minutos)</label>
              <input type="number" value={bufferMinutes} onChange={(e) => setBufferMinutes(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <p className="text-xs text-muted-foreground">Tempo de pausa automática entre um cliente e outro.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Antecedência mínima (minutos)</label>
              <input type="number" value={minBookingNotice} onChange={(e) => setMinBookingNotice(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <p className="text-xs text-muted-foreground">Quanto tempo antes o cliente pode fazer a marcação?</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Abertura da agenda (dias)</label>
              <input type="number" value={maxBookingDays} onChange={(e) => setMaxBookingDays(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <p className="text-xs text-muted-foreground">Até quantos dias no futuro o cliente pode agendar?</p>
            </div>

            <button type="submit" disabled={isUpdating} className="w-full mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60 flex justify-center items-center gap-2">
              <Save className="h-4 w-4" /> {isUpdating ? "Salvando..." : "Salvar Regras"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}