"use client";

import * as React from "react";
import { useUploadServiceImage } from "@/features/services/hooks/use-upload-service-image";

type ServiceImageUploadProps = {
  service: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
};

export function ServiceImageUpload({ service }: ServiceImageUploadProps) {
  const uploadMutation = useUploadServiceImage();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [successMessage, setSuccessMessage] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const previewUrl = React.useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return service.imageUrl ?? null;
  }, [selectedFile, service.imageUrl]);

  React.useEffect(() => {
    return () => {
      if (selectedFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile, previewUrl]);

  async function handleUpload() {
    if (!selectedFile) return;

    setSuccessMessage("");

    await uploadMutation.mutateAsync({
      serviceId: service.id,
      file: selectedFile,
    });

    setSuccessMessage("Imagem do serviço atualizada com sucesso.");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={service.name}
            className="h-20 w-20 rounded-2xl border border-border object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}

        <div>
          <p className="font-medium text-foreground">{service.name}</p>
          <p className="text-sm text-muted-foreground">
            Envie uma imagem JPG, PNG ou WEBP de até 2MB.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setSelectedFile(file);
          setSuccessMessage("");
        }}
        className="text-sm"
      />

      <button
        type="button"
        onClick={() => void handleUpload()}
        disabled={!selectedFile || uploadMutation.isPending}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploadMutation.isPending ? "Enviando imagem..." : "Salvar imagem"}
      </button>

      {uploadMutation.isError ? (
        <p className="text-sm text-red-600">
          {uploadMutation.error instanceof Error
            ? uploadMutation.error.message
            : "Erro ao enviar imagem."}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-sm text-green-600">{successMessage}</p>
      ) : null}
    </div>
  );
}