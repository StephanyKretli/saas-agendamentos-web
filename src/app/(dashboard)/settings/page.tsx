"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { User, CheckCircle2, Copy, Camera, Trash2, ShieldCheck, ExternalLink, Wallet } from "lucide-react";

export default function SettingsPage() {
  const { data: profile, isLoading } = useSettings();
  const isSalonOwner = !(profile as any)?.ownerId;
  const adminCentralizedPayments = (profile as any)?.owner?.centralizePayments ?? false;
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
    requirePixDeposit: false,    
    pixDepositPercentage: 20,  
    mercadoPagoAccessToken: "", 
    centralizePayments: true,
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
        // @ts-ignore
        requirePixDeposit: profile.requirePixDeposit ?? false,
        // @ts-ignore
        pixDepositPercentage: profile.pixDepositPercentage ?? 20,
        // @ts-ignore
        mercadoPagoAccessToken: profile.mercadoPagoAccessToken || "",
        // @ts-ignore
        centralizePayments: profile.centralizePayments ?? true,
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
    
    const payload = {
      name: formData.name,
      username: formData.username,
      requirePixDeposit: formData.requirePixDeposit,
      pixDepositPercentage: formData.pixDepositPercentage,
      mercadoPagoAccessToken: formData.mercadoPagoAccessToken,
      centralizePayments: formData.centralizePayments,
    };

    updateMutation.mutate(payload);
  };

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando...</div>;

  const inputStyle = "rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none";

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20 sm:pb-10 px-4 md:px-0">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua identidade e vitrine pública.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="perfil" className="space-y-6 sm:space-y-8 w-full">
          
          {/* NAVEGAÇÃO POR ABAS RESPONSIVA */}
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            <div className="w-max sm:w-fit rounded-xl bg-muted/50 p-1 border border-border/50">
              <TabsList className="bg-transparent p-0 h-auto gap-1 w-full flex">
                <TabsTrigger 
                  value="perfil" 
                  onClick={handleTabClick}
                  className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="vitrine" 
                  onClick={handleTabClick}
                  className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Vitrine
                </TabsTrigger>
                <TabsTrigger 
                  value="seguranca" 
                  onClick={handleTabClick}
                  className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Segurança
                </TabsTrigger>
                <TabsTrigger 
                  value="pagamentos" 
                  onClick={handleTabClick}
                  className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-amber-600 data-[state=active]:text-amber-600"
                >
                  Pagamentos
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* ABA: PERFIL */}
          <TabsContent value="perfil" className="space-y-6 animate-in fade-in zoom-in-95 duration-300 outline-none">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
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

              <Card className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6">
                <div className="space-y-5 sm:space-y-6">
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
            <Card className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 max-w-2xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Link de Agendamento</label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-2.5 text-xs text-muted-foreground opacity-50">app.com/book/</span>
                      <input 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})}
                        className={`w-full pl-24 ${inputStyle}`}
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl gap-2 h-10 w-full sm:w-auto px-6">
                      <Copy className="h-3.5 w-3.5" /> Copiar Link
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ABA: SEGURANÇA */}
          <TabsContent value="seguranca" className="animate-in fade-in zoom-in-95 duration-300 outline-none">
            <Card className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 max-w-2xl">
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
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

          {/* ABA: PAGAMENTOS */}
          <TabsContent value="pagamentos" className="animate-in fade-in zoom-in-95 duration-300 outline-none">
            
            {!isSalonOwner && adminCentralizedPayments ? (
              
              /* O AVISO PARA O FUNCIONÁRIO */
              <Card className="rounded-3xl border border-border bg-muted/30 shadow-sm p-8 max-w-2xl flex flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Pagamentos Centralizados</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  A administração configurou o sistema para receber todos os pagamentos de forma centralizada. Você não precisa configurar o Mercado Pago.
                </p>
              </Card>

            ) : (

              /* O FORMULÁRIO PREMIUM (Dona ou Fluxo Direto) */
              <Card className="rounded-3xl border border-amber-500/20 shadow-sm overflow-hidden max-w-2xl">
                
                {/* CABEÇALHO DESTAQUE */}
                <div className="bg-amber-500/10 p-5 sm:p-6 border-b border-amber-500/10 flex items-start gap-4">
                  <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-600 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Proteção Contra Faltas</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure a cobrança de um sinal via PIX para garantir o comparecimento dos clientes e acabar com os horários vagos na agenda.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-8 bg-card">
                  
                  {/* INTERRUPTOR PRINCIPAL DO PIX */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        Cobrar PIX Antecipado (Sinal)
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Exija um pagamento parcial no momento do agendamento.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center shrink-0">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={formData.requirePixDeposit}
                        onChange={(e) => setFormData({...formData, requirePixDeposit: e.target.checked})}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>

                  {/* CAMPOS CONDICIONAIS COM FUNDO DESTACADO */}
                  {formData.requirePixDeposit && (
                    <div className="space-y-5 p-5 sm:p-6 rounded-2xl bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">
                          Porcentagem do Sinal (%)
                        </label>
                        <div className="relative max-w-[200px]">
                          <input 
                            type="number" 
                            min="1"
                            max="100"
                            value={formData.pixDepositPercentage}
                            onChange={(e) => setFormData({...formData, pixDepositPercentage: Number(e.target.value)})}
                            className={`w-full ${inputStyle} pl-4 pr-10`}
                          />
                          <span className="absolute right-4 top-2.5 text-sm font-bold text-muted-foreground">%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground flex flex-wrap items-center justify-between gap-2">
                          <span>Mercado Pago Access Token</span>
                          <a href="https://www.mercadopago.com.br/developers/panel/credentials" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                            Pegar minha chave <ExternalLink className="h-3 w-3" />
                          </a>
                        </label>
                        <input 
                          type="password" 
                          placeholder="APP_USR-..."
                          value={formData.mercadoPagoAccessToken}
                          onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})}
                          className={`w-full ${inputStyle} font-mono text-xs sm:text-sm`}
                        />
                        <p className="text-xs text-muted-foreground">
                          Cole a sua Chave de Produção para que o dinheiro caia direto na sua conta.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* BLOCO DE ROTEAMENTO DE EQUIPE (Só para Dona) */}
                  {isSalonOwner && (
                    <div className="pt-6 mt-2 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 hidden sm:block">
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-foreground flex items-center gap-2">
                            Centralizar Pagamentos da Equipe
                          </label>
                          <p className="text-xs text-muted-foreground mt-1 max-w-md">
                            <strong className="text-foreground/80">Ligado:</strong> Todo o dinheiro cai na sua conta.<br/>
                            <strong className="text-foreground/80 block mt-0.5">Desligado:</strong> Cada profissional recebe direto.
                          </p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex cursor-pointer items-center shrink-0">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={formData.centralizePayments}
                          onChange={(e) => setFormData({...formData, centralizePayments: e.target.checked})}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>
                  )}

                </div>
              </Card>

            )}

          </TabsContent>

        </Tabs>

        {/* BOTÃO SALVAR */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border sm:static sm:bg-transparent sm:border-0 sm:p-0 sm:pt-8 flex justify-end z-40">
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