export async function getClients(page: number = 1, search: string = "") {
  const response = await api.get(`/clients`, {
    params: { page, limit: 10, search },
    headers: getAuthHeaders(),
  });

  return response.data;
}
