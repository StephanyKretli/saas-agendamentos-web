"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Calendar, Clock, User, Scissors, XCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function PublicManageAppointmentPage() {
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Busca os dados do agendamento mal a página carrega
  useEffect(() => {
    if (token) {
      api.get(`/appointments/public/${token}`)
        .then((res: any) => {
          setAppointment(res.data || res);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Agendamento não encontrado ou link expirado.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token]);

  // 2. Função de cancelar o agendamento
  const handleCancel = async () => {
    if (!confirm("Tem a certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.")) return;

    setIsCanceling(true);
    try {
      await api.post(`/appointments/public/${token}/cancel`);
      toast.success("Agendamento cancelado com sucesso!");
      
      // Atualiza a tela para mostrar que foi cancelado
      setAppointment((prev: any) => ({ ...prev, status: "CANCELED" }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Não foi possível cancelar o agendamento.");
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <Card className="p-8 text-center max-w-sm w-full border-border/50 shadow-lg rounded-3xl">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-black text-foreground mb-2">Oops!</h2>
          <p className="text-sm text-muted-foreground font-medium">{error}</p>
        </Card>
      </div>
    );
  }

  const isCanceled = appointment.status === "CANCELED";
  const dateObj = new Date(appointment.date);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(dateObj);
  const formattedTime = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(dateObj);

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 flex justify-center">
      <div className="max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          {/* Mostra o nome do salão (user) que é o dono do agendamento */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-2 shadow-sm border border-primary/20">
            {isCanceled ? <XCircle className="h-8 w-8 text-destructive" /> : <CheckCircle2 className="h-8 w-8" />}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {isCanceled ? "Agendamento Cancelado" : "Detalhes do Horário"}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {appointment.user?.name || "Salão de Beleza"}
          </p>
        </div>

        <Card className={`rounded-3xl p-6 shadow-xl border overflow-hidden relative ${isCanceled ? "border-destructive/20 opacity-80" : "border-primary/10"}`}>
          
          {/* Se estiver cancelado, coloca uma faixa vermelha */}
          {isCanceled && (
             <div className="absolute top-0 left-0 right-0 bg-destructive/10 text-destructive text-xs font-bold text-center py-1.5 uppercase tracking-wider">
               Horário Cancelado
             </div>
          )}

          <div className={`space-y-6 ${isCanceled ? "mt-4" : ""}`}>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">{appointment.service?.name}</h3>
              <div className="flex items-center text-sm font-bold text-primary">
                R$ {(appointment.service?.priceCents / 100).toFixed(2).replace(".", ",")} 
                <span className="text-muted-foreground font-medium ml-2 text-xs">
                  • {appointment.service?.duration} min
                </span>
              </div>
            </div>

            <hr className="border-border/50" />

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="bg-muted p-2 rounded-xl text-muted-foreground"><Calendar className="h-4 w-4" /></div>
                <span className="capitalize">{formattedDate}</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="bg-muted p-2 rounded-xl text-muted-foreground"><Clock className="h-4 w-4" /></div>
                <span>{formattedTime}</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="bg-muted p-2 rounded-xl text-muted-foreground"><User className="h-4 w-4" /></div>
                <span>Com {appointment.professional?.name || "Equipe"}</span>
              </li>
            </ul>

            {!isCanceled && (
              <div className="pt-4 flex flex-col gap-3">
                <Button 
                  variant="destructive" 
                  onClick={handleCancel}
                  disabled={isCanceling}
                  className="w-full h-12 rounded-xl font-bold shadow-sm gap-2"
                >
                  {isCanceling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  {isCanceling ? "A cancelar..." : "Cancelar Agendamento"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Sujeito às políticas de cancelamento do salão.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}