"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface PixQrCodeProps {
  payload: string;
  className?: string;
}

/**
 * Gera o QR Code do PIX localmente, no proprio navegador.
 *
 * Antes o payload (valor, identificador da transacao e dados do recebedor) era
 * enviado para api.qrserver.com via <img src=...>, o que:
 *  1. vazava dados da transacao para um terceiro nao controlado pelo Syncro; e
 *  2. criava uma dependencia externa — se aquele servico caisse ou fosse
 *     bloqueado na rede da cliente, o QR Code simplesmente nao aparecia e a
 *     cobranca do sinal travava.
 */
export function PixQrCode({ payload, className }: PixQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!payload) {
      setFailed(true);
      return;
    }

    QRCode.toDataURL(payload, { width: 250, margin: 1 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (failed) {
    return (
      <div className={className}>
        <p className="text-xs text-muted-foreground text-center">
          Não foi possível gerar o QR Code. Use o PIX Copia e Cola abaixo.
        </p>
      </div>
    );
  }

  if (!dataUrl) {
    return <div className={`${className ?? ""} animate-pulse bg-zinc-200 dark:bg-zinc-800`} />;
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code PIX"
      className={className}
      draggable={false}
    />
  );
}
