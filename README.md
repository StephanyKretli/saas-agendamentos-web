# 📅 SaaS Agendamentos - Web (Frontend)

<p align="left">
  <a href="https://nextjs.org/" target="blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://reactjs.org/" target="blank"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://tailwindcss.com/" target="blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://tanstack.com/query/latest" target="blank"><img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" /></a>
</p>

## 📖 Sobre o Projeto
Aplicação web para o SaaS de Agendamentos Online. Este painel permite aos profissionais cadastrarem seus serviços, gerenciarem clientes e acompanharem seus agendamentos. Além disso, conta com páginas públicas otimizadas para os clientes finais realizarem suas reservas.

## 🚀 Tecnologias e Arquitetura
* **Framework:** Next.js (App Router)
* **Estilização e UI:** Tailwind CSS + componentes shadcn/ui.
* **Gerenciamento de Estado de Servidor:** TanStack Query (React Query).
* **Comunicação com a API:** Instância global do `Axios` interceptando requisições para extrair a propriedade `.data` e tratando tokens automaticamente.
* **Design Pattern:** Container/Presenter Pattern (Páginas atuam como "Smart Components" coordenando dados, enquanto as Listas e Cards são "Dumb Components" focados apenas na interface).
* **Feedback de Erros Global:** Configuração de `MutationCache` para disparar notificações (Toasts) automáticas em caso de erro na API.

## ⚙️ Configuração Local

1. Instale as dependências do projeto:
\`\`\`bash
npm install
\`\`\`

2. Crie um arquivo `.env.local` na raiz do projeto configurando a URL da API:
\`\`\`env
NEXT_PUBLIC_API_URL="http://127.0.0.1:3333"
\`\`\`

3. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o sistema rodando.
