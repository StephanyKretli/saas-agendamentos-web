"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { useUpdateFinancial } from "@/features/settings/hooks/use-update-financial";
import { useQueryClient } from "@tanstack/react-query"; // 🔴 Adicionado para re-fetch sem reload
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // 🔴 Adicionado para substituir window.confirm
import { toast } from "react-hot-toast";
import { 
  User, CheckCircle2, Copy, Camera, Trash2, ShieldCheck, 
  Settings as SettingsIcon, DollarSign, Percent, 
  CreditCard, AlertCircle, Sparkles, MessageCircle, Store, Lock, Zap,
  Eye, EyeOff // 🔴 Ícones de visibilidade adicionados
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion"; 
import { api } from "@/lib/api";

import { WhatsappConnect } from "@/components/whatsapp/whatsapp-connect";

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.4 } }
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useSettings();
  const isSalonOwner = !(profile as any)?.ownerId;
  const isAdmin = isSalonOwner || (profile as any)?.role === 'ADMIN'; 
  const adminCentralizedPayments = (profile as any)?.owner?.centralizePayments ?? false;
  const currentPlan = (profile as any)?.plan || 'STARTER';
  const isProPlan = currentPlan === 'PRO';
  
  const salonId = profile ? (isSalonOwner ? (profile as any).id : (profile as any).ownerId) : "";
  
  const updateMutation = useUpdateSettings();
  const updateFinancialMutation = useUpdateFinancial();
  const [isBillingActionLoading, setIsBillingActionLoading] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // 🔴 UX 1: Controle da aba ativa para exibir/esconder botão Salvar
  const [activeTab, setActiveTab] = useState("perfil");
  const tabsWithSave = ["perfil", "vitrine", "seguranca", "pagamentos"];
  const showSaveBar = tabsWithSave.includes(activeTab);

  // 🔴 UX 4: Toggle de visibilidade do token
  const [showToken, setShowToken] = useState(false);

  // 🔴 UX 2 & 6: Controle de modais (AlertDialog)
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: 'plan' | 'cancel' | 'photo' | null;
    payload?: any;
  }>({ isOpen: false, type: null });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔴 UX 5: Estado original para verificar isDirty
  const [originalData, setOriginalData] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    document: "",
    bio: "",
    avatarUrl: "",
    requirePixDeposit: false,    
    pixDepositPercentage: 20,  
    mercadoPagoAccessToken: "", 
    centralizePayments: true,
    absorbPixFee: true,
    commissionType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    defaultCommissionRate: 50 as number | "",
  });

  // 🔴 UX 10: Separação do form de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (profile) {
      const initialData = {
        name: profile.name || "",
        username: profile.username || "",
        email: (profile as any).email || "",
        phone: (profile as any).phone || "",
        document: (profile as any).document || "",
        bio: (profile as any).bio || "",
        avatarUrl: (profile as any).avatarUrl || "",
        requirePixDeposit: (profile as any).requirePixDeposit ?? false,
        pixDepositPercentage: (profile as any).pixDepositPercentage ?? 20,
        mercadoPagoAccessToken: (profile as any).mercadoPagoAccessToken || "",
        centralizePayments: (profile as any).centralizePayments ?? true,
        absorbPixFee: (profile as any).absorbPixFee ?? true,
        commissionType: (profile as any).commissionType ?? "PERCENTAGE",
        defaultCommissionRate: (profile as any).defaultCommissionRate ?? 50,
      };
      setFormData(initialData);
      setOriginalData(JSON.stringify(initialData)); // 🔴 Salva estado original
    }
  }, [profile]);

  // 🔴 Verifica se há alterações
  const isDirty = activeTab === "seguranca" 
  ? (!!passwordData.newPassword && !!passwordData.currentPassword) 
  : JSON.stringify(formData) !== originalData;

  // 🔴 UX 8: Máscara dinâmica de CPF/CNPJ
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    setFormData({ ...formData, document: value.substring(0, 18) });
  };

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
        setOriginalData(JSON.stringify({ ...formData, avatarUrl: (response as any).data.avatarUrl }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "A imagem é muito grande. Tente até 2MB.", { id: "upload-avatar" });
      setFormData(prev => ({ ...prev, avatarUrl: profile?.avatarUrl || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    if (!isDirty) return;

    // 🔴 Se estiver na aba segurança, dispara a troca de senha
    if (activeTab === "seguranca") {
      handlePasswordSubmit(e);
      return;
  }

    const settingsPayload = {
      name: formData.name, username: formData.username, phone: formData.phone,
      document: formData.document.replace(/\D/g, ''), bio: formData.bio, requirePixDeposit: formData.requirePixDeposit,
      pixDepositPercentage: formData.pixDepositPercentage, mercadoPagoAccessToken: formData.mercadoPagoAccessToken,
      centralizePayments: formData.centralizePayments,
    };
    const financialPayload = {
      absorbPixFee: formData.absorbPixFee, commissionType: formData.commissionType,
      defaultCommissionRate: formData.defaultCommissionRate === "" ? 0 : Number(formData.defaultCommissionRate),
    };

    try {
      await Promise.all([
        updateMutation.mutateAsync(settingsPayload),
        updateFinancialMutation.mutateAsync(financialPayload)
      ]);
      setOriginalData(JSON.stringify(formData));
      toast.success("Configurações guardadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao guardar as configurações.");
    }
  };

  // 🔴 UX 10: Handler separado para senha
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      setIsPasswordLoading(true);
      await api.patch('/settings/password', passwordData);
      toast.success("Senha atualizada com sucesso!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar senha.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleGerirPagamento = async () => {
    try {
      setIsBillingActionLoading(true);
      const response = await api.get('/billing/manage');
      const responseData = response as any;
      const url = responseData.manageUrl || responseData.data?.manageUrl;
      if (url) {
        toast.success("Redirecionando para o portal seguro...");
        window.open(url, '_blank'); 
      } else {
        throw new Error("Link não encontrado.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao acessar portal de pagamento.");
    } finally {
      setIsBillingActionLoading(false);
    }
  };

  // 🔴 UX 9: InvalidateQueries em vez de reload
  const executePlanChange = async () => {
    const newPlan = dialogConfig.payload;
    try {
      setIsChangingPlan(true);
      await api.post('/billing/plan', { plan: newPlan });
      toast.success(`Plano atualizado para ${newPlan} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["settings"] }); // Re-fetch silencioso
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao alterar o plano.");
    } finally {
      setIsChangingPlan(false);
      setDialogConfig({ isOpen: false, type: null });
    }
  };

  const executeCancelation = async () => {
    try {
      toast.loading("A cancelar assinatura...", { id: "cancel-sub" });
      await api.delete('/billing/cancel');
      toast.success("Assinatura cancelada com sucesso!", { id: "cancel-sub" });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao cancelar assinatura.", { id: "cancel-sub" });
    } finally {
      setDialogConfig({ isOpen: false, type: null });
    }
  };

  const isSaving = updateMutation.isPending || updateFinancialMutation.isPending;

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

  const inputStyle = "rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm shadow-sm transition-all focus:border-primary/50 focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none hover:border-border";

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-12 max-w-6xl mx-auto px-4 sm:px-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 shadow-sm">
            <SettingsIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Configurações</h1>
            <p className="mt-1 text-base text-muted-foreground font-medium">Faça a gestão da sua identidade, vitrine pública e integrações.</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 w-full">
        
        <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          <div className="w-max sm:w-fit rounded-2xl bg-muted/40 p-1.5 border border-border/50 shadow-sm">
            <TabsList className="bg-transparent p-0 h-auto gap-1.5 w-full flex">
              <TabsTrigger value="perfil" className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary flex items-center gap-2">
                <User className="h-4 w-4" /> Perfil {activeTab === "perfil" && isDirty && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger value="vitrine" className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary flex items-center gap-2">
                <Store className="h-4 w-4" /> Vitrine {activeTab === "vitrine" && isDirty && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-green-600 text-muted-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </TabsTrigger>
              <TabsTrigger value="pagamentos" className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-amber-600/70 data-[state=active]:text-amber-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Financeiro 
                {/* 🔴 UX 3: Badge PRO visível na aba */}
                {!isProPlan && <span className="ml-1 text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full">PRO</span>}
                {activeTab === "pagamentos" && isDirty && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger value="seguranca" className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary flex items-center gap-2">
                <Lock className="h-4 w-4" /> Segurança
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="assinatura" className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-purple-600/70 data-[state=active]:text-purple-600 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Assinatura
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        </div>

        {/* 🔴 Formulário principal engloba apenas as abas gerenciáveis */}
        <form onSubmit={handleSubmit}>
          <TabsContent value="perfil" className="outline-none">
            <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 flex flex-col items-center justify-center text-center gap-4 transition-all hover:shadow-md hover:border-primary/20">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="h-32 w-32 rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center transition-all group-hover:border-primary/30 group-hover:shadow-md">
                    {formData.avatarUrl ? <img src={formData.avatarUrl} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <User className="h-14 w-14 text-muted-foreground/40" />}
                  </div>
                  <div className="absolute bottom-0 right-0 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-110"><Camera className="h-4 w-4" /></div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <div className="mt-2">
                  <h4 className="text-base font-bold text-foreground">Foto de Perfil</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Recomendado: 400x400px</p>
                </div>
                {formData.avatarUrl && (
                  <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs hover:bg-destructive/10 font-bold mt-1" 
                    onClick={() => setDialogConfig({ isOpen: true, type: 'photo' })}> {/* 🔴 UX 6 */}
                    <Trash2 className="h-3 w-3 mr-2" /> Remover Foto
                  </Button>
                )}
              </Card>

              <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 sm:p-8 transition-all hover:shadow-md">
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome da Empresa</label>
                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full ${inputStyle}`} placeholder="Ex: Studio Beauty" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">WhatsApp</label>
                      <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full ${inputStyle}`} placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CPF ou CNPJ</label>
                      {/* 🔴 UX 8: Máscara aplicada */}
                      <input value={formData.document} onChange={handleDocumentChange} className={`w-full ${inputStyle}`} placeholder="000.000.000-00" maxLength={18} />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio / Descrição</label>
                    {/* 🔴 UX 7: Contador de Bio */}
                    <textarea value={formData.bio} maxLength={300} onChange={(e) => setFormData({...formData, bio: e.target.value})} className={`w-full min-h-[120px] resize-none ${inputStyle}`} placeholder="Conte para os seus clientes o que o seu espaço oferece de melhor..." />
                    <p className="text-xs text-right text-muted-foreground font-medium">{formData.bio.length}/300 caracteres</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="vitrine" className="outline-none">
            <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
              <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 sm:p-8 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Store className="h-6 w-6" /></div>
                  <div>
                    <h2 className="text-xl font-black text-foreground">A sua Vitrine Online</h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Personalize o link que os seus clientes usam para agendar.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Link de Agendamento Público</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-3.5 text-sm text-muted-foreground opacity-60 font-medium">app.com/book/</span>
                      <input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})} className={`w-full pl-[110px] ${inputStyle} font-semibold text-primary`} />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                      <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl gap-2 h-[46px] w-full sm:w-auto px-8 font-bold shadow-sm border-border hover:bg-muted"><Copy className="h-4 w-4" /> Copiar</Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="pagamentos" className="outline-none">
  <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
    
    {/* ALERTA PARA NÃO-PROPRIETÁRIOS */}
    {!isSalonOwner && adminCentralizedPayments && (
      <Card className="rounded-3xl border border-border/50 bg-muted/20 shadow-sm p-10 flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-5 shadow-inner">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-black text-foreground">Gestão Centralizada</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md font-medium leading-relaxed">
          As regras financeiras e a cobrança de PIX são geridas exclusivamente pela administração do salão.
        </p>
      </Card>
    )}

    {/* PROTEÇÃO CONTRA FALTAS (SINAL) */}
    {(isSalonOwner || (!isSalonOwner && !adminCentralizedPayments)) && (
      <Card className={`rounded-3xl border shadow-lg overflow-hidden transition-all mt-8 ${isProPlan ? 'border-amber-500/20 ring-1 ring-amber-500/10 hover:shadow-xl' : 'border-border/50'}`}>
        <div className={`p-6 border-b flex items-start gap-4 ${isProPlan ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/10' : 'bg-muted/30 border-border/50'}`}>
          <div className={`p-3 rounded-2xl shrink-0 shadow-inner ${isProPlan ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className={`text-xl font-black ${isProPlan ? 'text-foreground' : 'text-muted-foreground'}`}>Proteção Contra Faltas</h2>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Configure a cobrança de um sinal via PIX.</p>
            </div>
            {!isProPlan && (
              <span className="flex items-center gap-1 text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                <Lock className="h-3 w-3" /> PRO
              </span>
            )}
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 space-y-6 bg-card transition-all ${!isProPlan ? 'opacity-50 pointer-events-none select-none grayscale-[50%]' : ''}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/50">
            <div className="max-w-md">
              <label className="text-base font-bold text-foreground">Cobrar PIX Antecipado (Sinal)</label>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Exija um pagamento parcial no momento do agendamento online.</p>
            </div>
            <label className="relative inline-flex items-center shrink-0 cursor-pointer">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={formData.requirePixDeposit} 
                onChange={(e) => setFormData({...formData, requirePixDeposit: e.target.checked})} 
              />
              <div className="peer h-7 w-14 rounded-full bg-muted/60 border border-border after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <AnimatePresence>
            {formData.requirePixDeposit && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="space-y-8 p-6 mt-2 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-inner">
                  
                  {/* PERCENTUAL DO SINAL */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-foreground">Percentagem do Sinal</label>
                      <span className="text-4xl font-black text-amber-600">{formData.pixDepositPercentage}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      step="5" 
                      value={formData.pixDepositPercentage} 
                      onChange={(e) => setFormData({...formData, pixDepositPercentage: Number(e.target.value)})} 
                      className="w-full h-3 bg-amber-500/20 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                  </div>

                  <hr className="border-amber-500/10" />

                  {/* CAMPO DO TOKEN E PASSO A PASSO */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-foreground">Mercado Pago Access Token</label>
                        <a 
                          href="https://www.mercadopago.com.br/developers/pt/panel" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                          Ir para Painel Developer <Copy className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="relative">
                        <input 
                          type={showToken ? "text" : "password"} 
                          placeholder="APP_USR-..." 
                          value={formData.mercadoPagoAccessToken} 
                          onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})} 
                          className={`w-full ${inputStyle} pr-12 font-mono text-sm h-12 border-amber-500/30 focus:border-amber-500 focus:ring-amber-500/20`} 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowToken(!showToken)} 
                          className="absolute right-3 top-3.5 text-muted-foreground hover:text-amber-600 transition-colors"
                        >
                          {showToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* GUIA PASSO A PASSO */}
                    <div className="bg-background/50 rounded-xl p-5 border border-amber-500/10 space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5" /> Como obter seu Token:
                      </p>
                      <ul className="space-y-2">
                        <li className="text-[13px] text-muted-foreground font-medium flex gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600">1</span>
                          Acesse o Mercado Pago Developers e crie uma aplicação (Checkout Transparente).
                        </li>
                        <li className="text-[13px] text-muted-foreground font-medium flex gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600">2</span>
                          No menu lateral, vá em Credenciais de Produção.
                        </li>
                        <li className="text-[13px] text-muted-foreground font-medium flex gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600">3</span>
                          Copie o campo "Access Token" (começa com APP_USR) e cole acima.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    )}

    {/* REPASSES E COMISSÕES */}
    {isSalonOwner && (
      <Card className={`rounded-3xl border shadow-lg overflow-hidden transition-all mt-8 ${isProPlan ? 'border-primary/20 ring-1 ring-primary/10 hover:shadow-xl' : 'border-border/50'}`}>
        <div className={`p-6 border-b flex items-start gap-4 ${isProPlan ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/10' : 'bg-muted/30 border-border/50'}`}>
          <div className={`p-3 rounded-2xl shrink-0 shadow-inner ${isProPlan ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className={`text-xl font-black ${isProPlan ? 'text-foreground' : 'text-muted-foreground'}`}>Repasses e Comissões</h2>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Defina as regras financeiras da sua equipe.</p>
            </div>
            {!isProPlan && (
              <span className="flex items-center gap-1 text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                <Lock className="h-3 w-3" /> PRO
              </span>
            )}
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 space-y-8 bg-card transition-all ${!isProPlan ? 'opacity-50 pointer-events-none select-none grayscale-[50%]' : ''}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/50">
            <div className="max-w-md">
              <label className="text-base font-bold text-foreground">Centralizar Pagamentos</label>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Se ativo, todo o valor dos agendamentos entra na conta do salão.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={formData.centralizePayments} 
                onChange={(e) => setFormData({...formData, centralizePayments: e.target.checked})} 
              />
              <div className="peer h-7 w-14 rounded-full bg-muted/60 border border-border after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:border-primary peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-border/50">
            <div className="max-w-md">
              <label className="text-base font-bold text-foreground">Absorver Taxa do PIX</label>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Se desativado, a taxa é descontada antes de calcular a comissão.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={formData.absorbPixFee} 
                onChange={(e) => setFormData({...formData, absorbPixFee: e.target.checked})} 
              />
              <div className="peer h-7 w-14 rounded-full bg-muted/60 border border-border after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:border-primary peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tipo de Comissão</label>
              <div className="flex gap-4 p-1 bg-muted/30 rounded-xl">
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg cursor-pointer transition-all ${formData.commissionType === "PERCENTAGE" ? "bg-card shadow-sm ring-1 ring-border text-foreground font-bold" : "text-muted-foreground hover:bg-muted/50 font-medium"}`}>
                  <input type="radio" name="commissionType" value="PERCENTAGE" checked={formData.commissionType === "PERCENTAGE"} onChange={() => setFormData({...formData, commissionType: "PERCENTAGE"})} className="hidden" />
                  <Percent className="h-4 w-4" /> Porcentagem
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg cursor-pointer transition-all ${formData.commissionType === "FIXED" ? "bg-card shadow-sm ring-1 ring-border text-foreground font-bold" : "text-muted-foreground hover:bg-muted/50 font-medium"}`}>
                  <input type="radio" name="commissionType" value="FIXED" checked={formData.commissionType === "FIXED"} onChange={() => setFormData({...formData, commissionType: "FIXED"})} className="hidden" />
                  <DollarSign className="h-4 w-4" /> Fixo (R$)
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                {formData.commissionType === "PERCENTAGE" ? "Taxa Base Padrão" : "Valor Base Padrão"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {formData.commissionType === "PERCENTAGE" ? <Percent className="h-4 w-4 text-muted-foreground" /> : <span className="text-muted-foreground text-sm font-bold">R$</span>}
                </div>
                <input 
                  type="number" 
                  min="0" 
                  step={formData.commissionType === "PERCENTAGE" ? "1" : "0.01"} 
                  placeholder="Ex: 50" 
                  value={formData.defaultCommissionRate} 
                  onChange={(e) => setFormData({...formData, defaultCommissionRate: e.target.value ? Number(e.target.value) : ""})} 
                  className={`w-full pl-12 h-[52px] text-lg font-semibold ${inputStyle}`} 
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    )}
  </motion.div>
</TabsContent>

          {/* 🔴 UX 10: Form de Segurança isolado */}
        <TabsContent value="seguranca" className="outline-none">
          <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
            <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 sm:p-8 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                <div className="bg-muted p-3 rounded-2xl text-foreground"><Lock className="h-6 w-6" /></div>
                <div>
                  <h2 className="text-xl font-black text-foreground">Segurança da Conta</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Atualize a sua senha de acesso ao painel.</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Senha Atual</label>
                  <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className={inputStyle} placeholder="••••••••" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
                  <input type="password" required minLength={6} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className={inputStyle} placeholder="Mínimo 6 caracteres" />
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

          {/* 🔴 UX 1: Renderização condicional da barra de Salvar */}
          {showSaveBar && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 sm:static sm:bg-transparent sm:border-0 sm:p-0 sm:pt-10 flex justify-end z-40">
              <motion.div whileHover={isDirty ? { scale: 1.02 } : {}} whileTap={isDirty ? { scale: 0.98 } : {}} className="w-full sm:w-auto shadow-xl sm:shadow-none rounded-2xl">
                <Button type="submit" disabled={isSaving || !isDirty} className="h-14 w-full sm:w-auto rounded-2xl px-12 text-base font-bold shadow-md transition-all">
                  {isSaving ? "A guardar as alterações..." : isDirty ? "Salvar Configurações" : "Tudo Salvo"}
                  {!isSaving && <CheckCircle2 className="ml-2 h-5 w-5" />}
                </Button>
              </motion.div>
            </div>
          )}
        </form>

        <TabsContent value="whatsapp" className="outline-none">
           <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
              <div className="flex justify-center sm:justify-start">
                <WhatsappConnect salonId={salonId} />
              </div>
           </motion.div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="assinatura" className="outline-none">
            <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl space-y-6">
              <Card className="rounded-3xl border border-purple-500/20 shadow-lg overflow-hidden ring-1 ring-purple-500/10">
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-6 border-b border-purple-500/10 flex items-start gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-600 shrink-0 shadow-inner">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground">Gestão da Assinatura</h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Controle o seu plano e os dados de faturação.</p>
                  </div>
                </div>
                
                <div className="p-6 sm:p-8 space-y-8 bg-card">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 gap-6 shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-purple-600/80 uppercase tracking-wider">O seu plano atual</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <h3 className="text-3xl font-black text-foreground capitalize tracking-tight">{currentPlan}</h3>
                        {isProPlan && (
                           <span className="flex items-center gap-1.5 text-xs font-black bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                             <Sparkles className="h-3.5 w-3.5" /> Ilimitado
                           </span>
                        )}
                      </div>
                    </div>
                    
                    <Button type="button" onClick={handleGerirPagamento} disabled={isBillingActionLoading} className="rounded-xl font-bold shadow-md bg-purple-600 hover:bg-purple-700 text-white h-12 px-6">
                      {isBillingActionLoading ? "A redirecionar..." : "Portal de Pagamentos"}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Mudar de Plano</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      
                      {/* STARTER */}
                      <div className={`relative p-5 rounded-2xl border transition-all ${currentPlan === 'STARTER' ? 'bg-muted/30 border-primary/20 ring-1 ring-primary/20' : 'bg-card border-border hover:border-primary/40'}`}>
                        {currentPlan === 'STARTER' && <div className="absolute top-3 right-4 text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">Plano Atual</div>}
                        <h4 className="font-black text-lg">Starter</h4>
                        <p className="text-xl font-black text-foreground mt-1">R$ 49 <span className="text-xs text-muted-foreground font-medium">/mês</span></p>
                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Até 3 profissionais</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Agenda Online 24/7</li>
                          <li className="flex items-center gap-2 opacity-50"><Lock className="h-3 w-3" /> PIX Antecipado bloqueado</li>
                        </ul>
                        <Button 
                          type="button" 
                          disabled={currentPlan === 'STARTER' || isChangingPlan} 
                          onClick={() => setDialogConfig({ isOpen: true, type: 'plan', payload: 'STARTER' })}
                          variant={currentPlan === 'STARTER' ? "secondary" : "outline"}
                          className="w-full mt-6 rounded-xl font-bold h-10"
                        >
                          {currentPlan === 'STARTER' ? "Ativo" : "Fazer Downgrade"}
                        </Button>
                      </div>

                      {/* PRO */}
                      <div className={`relative p-5 rounded-2xl border transition-all ${currentPlan === 'PRO' ? 'bg-amber-500/5 border-amber-500/30 ring-1 ring-amber-500/20' : 'bg-card border-border hover:border-amber-500/40'}`}>
                        {currentPlan === 'PRO' && <div className="absolute top-3 right-4 text-[10px] font-black uppercase text-amber-600 bg-amber-500/20 px-2 py-1 rounded-full">Plano Atual</div>}
                        <h4 className="font-black text-lg flex items-center gap-2">Pro <Zap className="h-4 w-4 text-amber-500" fill="currentColor" /></h4>
                        <p className="text-xl font-black text-foreground mt-1">R$ 99 <span className="text-xs text-muted-foreground font-medium">/mês</span></p>
                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-amber-500" /> Profissionais Ilimitados</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-amber-500" /> Cobrança de PIX (Sinal)</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-amber-500" /> Gestão de Comissões</li>
                        </ul>
                        <Button 
                          type="button" 
                          disabled={currentPlan === 'PRO' || isChangingPlan} 
                          onClick={() => setDialogConfig({ isOpen: true, type: 'plan', payload: 'PRO' })}
                          className={`w-full mt-6 rounded-xl font-bold h-10 ${currentPlan === 'PRO' ? 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/20' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'}`}
                        >
                          {currentPlan === 'PRO' ? "Ativo" : "Mudar para o PRO"}
                        </Button>
                      </div>

                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col sm:flex-row gap-5">
                    <div className="bg-destructive/10 p-3 rounded-full shrink-0 h-fit">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="w-full space-y-4">
                      <div>
                        <h4 className="font-black text-destructive text-lg">Cancelar Assinatura</h4>
                        <p className="text-sm text-destructive/80 font-medium mt-1 leading-relaxed">
                          Ao cancelar a assinatura, perderá o acesso ao painel de gestão no final do ciclo.
                        </p>
                      </div>
                      <Button type="button" variant="destructive" onClick={() => setDialogConfig({ isOpen: true, type: 'cancel' })} className="rounded-xl font-bold shadow-sm w-full sm:w-auto h-11 px-6">
                        Cancelar Assinatura
                      </Button>
                    </div>
                  </div>

                </div>
              </Card>
            </motion.div>
          </TabsContent>
        )}
      </Tabs>

      {/* 🔴 UX 2: Centralização de Diálogos de Confirmação (Estilizado para Dark Mode/Alto Contraste) */}
      <AlertDialog open={dialogConfig.isOpen} onOpenChange={(open) => !open && setDialogConfig({ isOpen: false, type: null })}>
        <AlertDialogContent className="rounded-3xl border border-border/40 bg-[#141415] p-6 sm:p-8 shadow-2xl sm:max-w-[420px]">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-xl font-black text-white">
              {dialogConfig.type === 'plan' && `Mudar para o plano ${dialogConfig.payload}?`}
              {dialogConfig.type === 'cancel' && "Deseja mesmo cancelar?"}
              {dialogConfig.type === 'photo' && "Remover foto de perfil?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-zinc-400 leading-relaxed">
              {dialogConfig.type === 'plan' && "O novo valor será aplicado na sua próxima fatura. Os recursos serão atualizados instantaneamente."}
              {dialogConfig.type === 'cancel' && "A cobrança será interrompida, mas manterá os recursos PRO até ao fim do ciclo pago."}
              {dialogConfig.type === 'photo' && "Esta ação removerá a sua foto atual e voltará a exibir o ícone padrão."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* Substituímos o AlertDialogFooter por uma div normal */}
          <div className="mt-6 border-t border-white/5 pt-6 w-full flex flex-col-reverse sm:flex-row items-center justify-center gap-4">
            <AlertDialogCancel className="!m-0 w-full sm:w-[140px] rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-zinc-300 font-bold h-12 transition-all">
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (dialogConfig.type === 'plan') executePlanChange();
                if (dialogConfig.type === 'cancel') executeCancelation();
                if (dialogConfig.type === 'photo') {
                  setFormData(prev => ({ ...prev, avatarUrl: "" }));
                  setDialogConfig({ isOpen: false, type: null });
                }
              }}
              className={`!m-0 w-full sm:w-[140px] rounded-xl font-bold h-12 shadow-md transition-all ${
                dialogConfig.type === 'cancel' || dialogConfig.type === 'photo' 
                  ? 'bg-red-500 hover:bg-red-600 text-white border border-red-500' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-500'
              }`}
            >
              Confirmar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}