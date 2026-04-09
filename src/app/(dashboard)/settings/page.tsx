"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { useUpdateFinancial } from "@/features/settings/hooks/use-update-financial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { 
  User, CheckCircle2, Copy, Camera, Trash2, ShieldCheck, 
  Settings as SettingsIcon, DollarSign, Percent, 
  CreditCard, AlertCircle, Sparkles, MessageCircle, Store, Lock
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion"; 
import { api } from "@/lib/api";

import { WhatsappConnect } from "@/components/whatsapp/whatsapp-connect";

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.4 } }
};

export default function SettingsPage() {
  const { data: profile, isLoading } = useSettings();
  const isSalonOwner = !(profile as any)?.ownerId;
  const isAdmin = isSalonOwner || (profile as any)?.role === 'ADMIN'; 
  const adminCentralizedPayments = (profile as any)?.owner?.centralizePayments ?? false;
  const isProPlan = (profile as any)?.plan === 'PRO';
  
  const salonId = profile ? (isSalonOwner ? (profile as any).id : (profile as any).ownerId) : "";
  
  const updateMutation = useUpdateSettings();
  const updateFinancialMutation = useUpdateFinancial();
  const [isBillingActionLoading, setIsBillingActionLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    document: "",
    bio: "",
    avatarUrl: "",
    currentPassword: "",
    newPassword: "",
    requirePixDeposit: false,    
    pixDepositPercentage: 20,  
    mercadoPagoAccessToken: "", 
    centralizePayments: true,
    absorbPixFee: true,
    commissionType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    defaultCommissionRate: 50 as number | "",
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
        document: profile.document || "",
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
        // @ts-ignore
        absorbPixFee: profile.absorbPixFee ?? true,
        // @ts-ignore
        commissionType: profile.commissionType ?? "PERCENTAGE",
        // @ts-ignore
        defaultCommissionRate: profile.defaultCommissionRate ?? 50,
      }));
    }
  }, [profile]);

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link = `${window.location.origin}/book/${formData.username}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado com sucesso!");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatarUrl: previewUrl }));

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      toast.loading("A carregar foto...", { id: "upload-avatar" });
      const response = await api.patch('/settings/avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Foto de perfil atualizada!", { id: "upload-avatar" });
      if ((response as any).data?.avatarUrl) {
        setFormData(prev => ({ ...prev, avatarUrl: (response as any).data.avatarUrl }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao carregar imagem.", { id: "upload-avatar" });
      setFormData(prev => ({ ...prev, avatarUrl: profile?.avatarUrl || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const settingsPayload = {
      name: formData.name,
      username: formData.username,
      phone: formData.phone,
      document: formData.document,
      bio: formData.bio,            
      requirePixDeposit: formData.requirePixDeposit,
      pixDepositPercentage: formData.pixDepositPercentage,
      mercadoPagoAccessToken: formData.mercadoPagoAccessToken,
      centralizePayments: formData.centralizePayments,
    };

    const financialPayload = {
      absorbPixFee: formData.absorbPixFee,
      commissionType: formData.commissionType,
      defaultCommissionRate: formData.defaultCommissionRate === "" ? 0 : Number(formData.defaultCommissionRate),
    };

    try {
      await Promise.all([
        updateMutation.mutateAsync(settingsPayload),
        updateFinancialMutation.mutateAsync(financialPayload)
      ]);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar as configurações.");
    }
  };

  const handleGerirPagamento = async () => {
    try {
      setIsBillingActionLoading(true);
      const response = await api.get('/billing/manage');
      const url = (response as any).manageUrl || (response as any).data?.manageUrl;
      
      if (url) {
        window.open(url, '_blank'); 
      } else {
        throw new Error("Link não encontrado.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao acessar portal de faturamento.");
    } finally {
      setIsBillingActionLoading(false);
    }
  };

  const isSaving = updateMutation.isPending || updateFinancialMutation.isPending;

  if (isLoading) return <div className="p-20 text-center">A carregar configurações...</div>;

  const inputStyle = "w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm shadow-sm transition-all focus:border-primary/50 focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none hover:border-border";

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-12 max-w-6xl mx-auto px-4 sm:px-0">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
          <SettingsIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
          <p className="text-muted-foreground font-medium">Gestão da identidade, vitrine e financeira.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="perfil" className="space-y-8">
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0">
            <TabsList className="bg-muted/40 p-1.5 rounded-2xl border border-border/50 w-fit flex gap-1.5">
              <TabsTrigger value="perfil" className="rounded-xl px-5 font-bold data-[state=active]:bg-card flex items-center gap-2"><User className="h-4 w-4" /> Perfil</TabsTrigger>
              <TabsTrigger value="vitrine" className="rounded-xl px-5 font-bold data-[state=active]:bg-card flex items-center gap-2"><Store className="h-4 w-4" /> Vitrine</TabsTrigger>
              <TabsTrigger value="whatsapp" className="rounded-xl px-5 font-bold data-[state=active]:bg-card flex items-center gap-2 text-green-600"><MessageCircle className="h-4 w-4" /> WhatsApp</TabsTrigger>
              <TabsTrigger value="pagamentos" className="rounded-xl px-5 font-bold data-[state=active]:bg-card text-amber-600 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Financeiro</TabsTrigger>
              <TabsTrigger value="seguranca" className="rounded-xl px-5 font-bold data-[state=active]:bg-card flex items-center gap-2"><Lock className="h-4 w-4" /> Segurança</TabsTrigger>
              {isAdmin && <TabsTrigger value="assinatura" className="rounded-xl px-5 font-bold data-[state=active]:bg-card text-purple-600 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Assinatura</TabsTrigger>}
            </TabsList>
          </div>

          <TabsContent value="perfil">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <Card className="rounded-3xl p-6 flex flex-col items-center justify-center gap-4 border-border/50">
                <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <div className="h-32 w-32 rounded-full border-4 border-muted overflow-hidden flex items-center justify-center bg-muted transition-all group-hover:border-primary/30">
                    {formData.avatarUrl ? <img src={formData.avatarUrl} className="h-full w-full object-cover" /> : <User className="h-12 w-12 text-muted-foreground/30" />}
                  </div>
                  <div className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg"><Camera className="h-4 w-4" /></div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-destructive font-bold" onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}>
                   <Trash2 className="h-3 w-3 mr-2" /> Remover Foto
                </Button>
              </Card>

              <Card className="rounded-3xl p-6 sm:p-8 space-y-6 border-border/50">
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Seu Nome / Nome da Empresa</label>
                  <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputStyle} placeholder="Ex: Studio Beauty" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">WhatsApp</label>
                    <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputStyle} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CPF ou CNPJ</label>
                    <input 
                      value={formData.document} 
                      onChange={(e) => setFormData({...formData, document: e.target.value.replace(/\D/g, '')})} 
                      className={inputStyle} 
                      placeholder="Apenas números" 
                      maxLength={14} 
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio / Descrição</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className={`min-h-25 resize-none ${inputStyle}`} placeholder="Fale sobre seu espaço..." />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitrine">
            <Card className="rounded-3xl p-8 max-w-3xl space-y-6 border-border/50">
               <div>
                 <h2 className="text-xl font-black">A sua Vitrine Online</h2>
                 <p className="text-sm text-muted-foreground font-medium">Personalize o link que os seus clientes usam para agendar.</p>
               </div>
               <div className="space-y-3">
                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Link Público</label>
                 <div className="flex gap-3">
                   <div className="relative flex-1">
                     <span className="absolute left-4 top-3.5 text-sm text-muted-foreground opacity-60">app.com/book/</span>
                     <input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})} className={`pl-[110px] ${inputStyle} font-semibold text-primary`} />
                   </div>
                   <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl px-6 font-bold h-[46px]"><Copy className="h-4 w-4 mr-2" /> Copiar</Button>
                 </div>
               </div>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
            <div className="max-w-3xl">
              <WhatsappConnect salonId={salonId} />
            </div>
          </TabsContent>

          <TabsContent value="pagamentos">
            <div className="space-y-6 max-w-3xl">
              <Card className={`rounded-3xl border shadow-lg overflow-hidden ${isProPlan ? 'border-amber-500/20' : 'border-border/50 opacity-50'}`}>
                <div className="p-6 bg-muted/30 border-b flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><ShieldCheck className="h-6 w-6" /></div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black">Proteção Contra Faltas (Sinal via PIX)</h2>
                      <p className="text-sm text-muted-foreground font-medium">Exija um pagamento parcial no agendamento.</p>
                    </div>
                    {!isProPlan && <span className="bg-amber-500/10 text-amber-600 text-[10px] font-black px-3 py-1 rounded-full border border-amber-500/20">PRO</span>}
                  </div>
                </div>
                <div className={`p-8 space-y-6 ${!isProPlan ? 'pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-foreground">Cobrar Sinal Antecipado</label>
                    <input type="checkbox" checked={formData.requirePixDeposit} onChange={(e) => setFormData({...formData, requirePixDeposit: e.target.checked})} className="h-6 w-6 accent-amber-500" />
                  </div>
                  {formData.requirePixDeposit && (
                    <div className="space-y-6 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                      <div className="space-y-4">
                        <div className="flex justify-between font-bold"><span>Percentagem</span><span>{formData.pixDepositPercentage}%</span></div>
                        <input type="range" min="5" max="100" step="5" value={formData.pixDepositPercentage} onChange={(e) => setFormData({...formData, pixDepositPercentage: Number(e.target.value)})} className="w-full h-2 bg-amber-500/20 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Mercado Pago Access Token</label>
                        <input type="password" value={formData.mercadoPagoAccessToken} onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})} className={inputStyle} placeholder="APP_USR-..." />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assinatura">
             <Card className="p-8 rounded-3xl border-purple-500/20 bg-purple-500/5 space-y-6 max-w-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold uppercase text-purple-600">Plano Atual</p>
                    <h3 className="text-3xl font-black capitalize tracking-tight">{profile?.plan || 'Starter'}</h3>
                  </div>
                  <Button type="button" onClick={handleGerirPagamento} disabled={isBillingActionLoading} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold h-12 px-8 shadow-lg transition-all">
                    {isBillingActionLoading ? "A carregar..." : "Portal de Pagamentos"}
                  </Button>
                </div>
             </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-10 flex justify-end">
          <Button type="submit" disabled={isSaving} className="h-14 px-12 rounded-2xl font-black text-base shadow-xl hover:scale-[1.02] transition-all">
            {isSaving ? "A guardar..." : "Salvar Configurações"}
            {!isSaving && <CheckCircle2 className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}