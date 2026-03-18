import { getAccessToken } from "@/lib/auth-storage";

export async function uploadServiceImage(serviceId: string, file: File) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/${serviceId}/image`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.message || "Não foi possível enviar a imagem do serviço.";
    throw new Error(message);
  }

  return response.json();
}