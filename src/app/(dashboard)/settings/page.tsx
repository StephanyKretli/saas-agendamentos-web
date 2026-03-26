"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, User, Phone, CheckCircle2, Copy, Camera, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

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
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
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
      }));
    }
  }, [profile]);

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link = `${window.location.origin}/book/${formData.username}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando...</div>;

  // PADRÃO DE INPUT IGUAL À PÁGINA DE BLOQUEIOS
  const inputStyle = "rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none";

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-10 px-4 md:px-0">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua identidade e vitrine pública.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="perfil" className="space-y-6 sm:space-y-8">
          
          {/* NAVEGAÇÃO POR ABAS (Estilo Bloqueios) */}          <div className="w-full sm:w-fit rounded-xl bg-muted/50 p-1 border border-border/50">
            <TabsList className="bg-transparent p-0 h-auto gap-1 w-full flex">
              <TabsTrigger 
                value="perfil" 
                className="flex-1 sm:flex-none sm:min-w-[120px] rounded-lg py-2.5 px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="vitrine" 
                className="flex-1 sm:flex-none sm:min-w-[120px] rounded-lg py-2.5 px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Vitrine
              </TabsTrigger>
              <TabsTrigger 
                value="seguranca" 
                className="flex-1 sm:flex-none sm:min-w-[120px] rounded-lg py-2.5 px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Segurança
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ABA: PERFIL */}
          <TabsContent value="perfil" className="space-y-6 animate-in fade-in zoom-in-95 duration-300 outline-none">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              
              {/* CARD DE FOTO (Recuperado e Melhorado) */}
              <Card className="rounded-3xl border border-border bg-card shadow-sm p-6 flex flex-col items-center text-center gap-4">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center transition-all group-hover:border-primary/30">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-14 w-14 text-muted-foreground/40" />
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Alterar foto"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Foto de Perfil</h4>
                  <p className="text-xs text-muted-foreground mt-1">Recomendado: 400x400px</p>
                </div>
                {formData.avatarUrl && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive text-xs hover:bg-destructive/10" 
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                  >
                    <Trash2 className="h-3 w-3 mr-2" /> Remover Foto
                  </Button>
                )}
              </Card>

              {/* INFO GERAL */}
              <Card className="rounded-3xl border border-border bg-card shadow-sm p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome da Empresa</label>
                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full ${inputStyle}`} placeholder="Ex: Studio Beauty" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">WhatsApp</label>
                    <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full ${inputStyle}`} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio / Descrição</label>
                    <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className={`w-full min-h-24 resize-none ${inputStyle}`} placeholder="Conte para seus clientes o que você faz..." />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ABA: VITRINE */}
          <TabsContent value="vitrine" className="animate-in fade-in zoom-in-95 duration-300 outline-none">
            <Card className="rounded-3xl border border-border bg-card shadow-sm p-6 max-w-2xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Link de Agendamento</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-2.5 text-xs text-muted-foreground opacity-50">app.com/book/</span>
                      <input 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})}
                        className={`w-full pl-24 ${inputStyle}`}
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl gap-2 h-10 px-6">
                      <Copy className="h-3.5 w-3.5" /> Copiar Link
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ABA: SEGURANÇA */}
          <TabsContent value="seguranca" className="animate-in fade-in zoom-in-95 duration-300 outline-none">
            <Card className="rounded-3xl border border-border bg-card shadow-sm p-6 max-w-2xl">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Senha Atual</label>
                  <input type="password" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} className={`w-full ${inputStyle}`} placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
                  <input type="password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} className={`w-full ${inputStyle}`} placeholder="Mínimo 6 caracteres" />
                </div>
              </div>
            </Card>
          </TabsContent>

        </Tabs>

        {/* BOTÃO SALVAR (Sempre visível) */}
        <div className="flex justify-end pt-8">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="h-12 w-full sm:w-auto rounded-2xl px-12 text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            {!updateMutation.isPending && <CheckCircle2 className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}