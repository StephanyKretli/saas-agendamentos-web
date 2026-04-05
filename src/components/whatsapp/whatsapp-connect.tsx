"use client";

import { useState, useEffect, useCallback } from "react";
import { QrCode, Smartphone, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Importe a sua configuração de API (ajuste o caminho se necessário)
import { api } from "@/lib/api"; 

interface WhatsappConnectProps {
  salonId: string; // Recebemos o ID do Salão como propriedade
}

export function WhatsappConnect({ salonId }: WhatsappConnectProps) {
  const [status, setStatus] = useState<"LOADING" | "DISCONNECTED" | "CONNECTED">("LOADING");
  if (!salonId) {
    return (
      <Card className="p-6 max-w-md w-full border-border bg-card shadow-sm flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">A carregar informações do salão...</p>
      </Card>
    );
  }
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Função para verificar se já está conectado
  const checkStatus = useCallback(async () => {
    try {
      const response = await api.get(`/whatsapp/status/${salonId}`);
      const currentStatus = (response as any).data?.status || (response as any).status;
      
      if (currentStatus === 'open') {
        setStatus("CONNECTED");
      } else {
        setStatus("DISCONNECTED");
      }
    } catch (error) {
      setStatus("DISCONNECTED");
    }
  }, [salonId]);

  // Função para pedir um novo QR Code ao NestJS
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // 1. Criamos um carimbo de tempo para enganar o cache do navegador (304)
      const timestamp = new Date().getTime();
      
      // 2. Fazemos o pedido com o ?t=timestamp no final
      const response = await api.get(`/whatsapp/qr-code/${salonId}?t=${timestamp}`);
      
      // 3. Colocamos um console.log para vermos o que o NestJS enviou
      console.log("📦 Resposta do NestJS:", response);

      // 4. Mapeamos os dados (A Evolution v2 pode devolver como 'base64' em vez de 'qrCode')
      const data = (response as any).data || response;
      const qrCode = data?.qrCode || data?.base64; 
      
      if (qrCode) {
        // A API da Evolution já devolve com o prefixo, mas garantimos aqui
        setQrCodeBase64(qrCode.includes('base64') ? qrCode : `data:image/png;base64,${qrCode}`);
      } else {
        console.error("QR Code vazio na resposta:", data);
      }
    } catch (error) {
      console.error("Erro ao gerar QR Code", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Efeito 1: Checa o status logo que o componente aparece na tela
  useEffect(() => {
    // 1. Se o ID estiver vazio, cancela tudo!
    if (!salonId || salonId === 'undefined') {
      return;
    }
    
    // 2. Se tiver ID, tira do "carregando" e vai perguntar à API
    checkStatus();
  }, [salonId, checkStatus]);

  // Efeito 2: "Polling" (Fica a perguntar à API a cada 5 segundos se ela já escaneou)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Se o QR Code estiver na tela (desconectado), começamos a checar
    if (status === "DISCONNECTED" && qrCodeBase64) {
      interval = setInterval(() => {
        checkStatus();
      }, 5000); 
    }

    console.log("🕵️‍♂️ ID do Salão recebido no componente:", salonId); // 👈 ADICIONE ISTO

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, qrCodeBase64, checkStatus]);

  return (
    <Card className="p-6 max-w-md w-full border-border bg-card shadow-sm">
      <div className="space-y-6 text-center">
        
        {/* CABEÇALHO */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            WhatsApp do Salão
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Conecte o seu número para enviar lembretes automáticos aos clientes.
          </p>
        </div>

        {/* ESTADO: CARREGANDO */}
        {status === "LOADING" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3 animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            <p className="text-sm font-medium text-muted-foreground">A verificar conexão...</p>
          </div>
        )}

        {/* ESTADO: CONECTADO */}
        {status === "CONNECTED" && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-green-600">Conectado com Sucesso!</p>
              <p className="text-sm text-muted-foreground font-medium">O seu sistema já está a enviar mensagens.</p>
            </div>
          </div>
        )}

        {/* ESTADO: DESCONECTADO (MOSTRA O QR CODE) */}
        {status === "DISCONNECTED" && (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in">
            
            {!qrCodeBase64 ? (
              <div className="py-6 w-full">
                <Button 
                  onClick={generateQRCode} 
                  disabled={isGenerating}
                  className="w-full h-12 rounded-xl font-bold shadow-md gap-2"
                >
                  {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
                  {isGenerating ? "A gerar código..." : "Gerar QR Code de Conexão"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-border">
                  <img 
                    src={qrCodeBase64} 
                    alt="QR Code do WhatsApp" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                
                <p className="text-xs text-muted-foreground font-medium animate-pulse">
                  Abra o WhatsApp no telemóvel &gt; Aparelhos Conectados &gt; Escanear
                </p>

                <Button 
                  variant="outline" 
                  onClick={generateQRCode}
                  disabled={isGenerating}
                  className="mt-2 text-xs font-bold gap-2"
                >
                  <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  Atualizar QR Code
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </Card>
  );
}