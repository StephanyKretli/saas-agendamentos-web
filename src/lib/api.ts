import axios from 'axios';
import { getAccessToken } from './auth-storage';

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
    // 🛑 O NOSSO PORTEIRO VIP (AGORA MAIS INTELIGENTE)
    if (error.response && error.response.status === 402) {
      if (typeof window !== 'undefined') {
        // 👇 Só redireciona se já NÃO estivermos na página de planos!
        if (window.location.pathname !== '/billing') {
          window.location.href = '/billing';
        }
      }
      return Promise.reject(error);
    }

    // 🛠️ O resto do tratamento de erros
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      return Promise.reject(new Error(message || 'Ocorreu um erro inesperado.'));
    } else if (error.request) {
      return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique sua conexão.'));
    }
    
    return Promise.reject(new Error('Erro interno na aplicação.'));
  }
);