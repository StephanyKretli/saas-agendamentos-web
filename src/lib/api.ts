import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3333";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      return Promise.reject(new Error(message || 'Ocorreu um erro inesperado.'));
    } else if (error.request) {
      return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique sua conexão.'));
    }
    
    return Promise.reject(new Error('Erro interno na aplicação.'));
  }
);