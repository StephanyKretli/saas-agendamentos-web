"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, User, Mail, Phone, CheckCircle2, Copy, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: profile, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        // @ts-ignore
        email: profile.email || "",
        // @ts-ignore
        phone: profile.phone || "",
        // @ts-ignore
        bio: profile.bio || "",
        // @ts-ignore
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile]);

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link = `${window.location.origin}/book/${formData.username}`;
    navigator.clipboard.writeText(link);
    toast.success("Link de agendamento copiado!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui você integraria com seu serviço de upload (S3, Cloudinary, etc)
      // Por agora, vamos apenas simular um preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua identidade e vitrine pública.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECÇÃO: FOTO DE PERFIL */}
        <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Sua Foto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground/40" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <p className="text-sm font-medium">Foto de Perfil</p>
                <p className="text-xs text-muted-foreground max-w-[240px]">
                  Recomendamos uma imagem quadrada de pelo menos 400x400px. JPG ou PNG.
                </p>
                {formData.avatarUrl && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 w-fit mx-auto sm:mx-0"
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Remover foto
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD: LINK DE AGENDAMENTO */}
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Link de Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground opacity-50">
                  app.seuapp.com/
                </span>
                <Input 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})}
                  className="pl-28.75 rounded-xl font-medium" 
                  placeholder="seu-negocio"
                />
              </div>
              <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl gap-2 h-10">
                <Copy className="h-4 w-4" />
                Copiar Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CARD: PERFIL PROFISSIONAL */}
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nome da Empresa</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Studio Beauty"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">WhatsApp de Contato</label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold">Bio / Descrição</label>
              <Textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Conte para seus clientes o que você faz..."
                className="min-h-25 rounded-xl resize-none" 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="h-12 rounded-xl px-8 text-base shadow-md transition-all hover:scale-105"
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            {!updateMutation.isPending && <CheckCircle2 className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}