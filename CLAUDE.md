# Syncro Frontend (Web)

## Identidade Visual (Dark & Tech)
- **Vibe:** Autoridade, premium, minimalista (referências: Vercel, Stripe).
- **Cores:** Fundo `zinc-950`, bordas `zinc-800/50`, destaques `amber-500` (alertas/premium) ou `primary`.
- **UI:** Glassmorphism moderado (`backdrop-blur`), bordas arredondadas (`rounded-2xl`). 

## Stack e Arquitetura Front
- Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion.
- Estado derivado do servidor usando **React Query**. Evite `localStorage` para dados críticos.
- Toda mutation do React Query deve invalidar a query correspondente.

## Regras de Interface e UX
- **Mobile-First Extremo:** 90% do uso é via celular. Sem tabelas complexas, prefira listas de cards. Áreas de toque de no mínimo `h-10`.
- **Early returns:** Evite aninhamento profundo.
- **Datas:** Use estritamente `date-fns` (locale `ptBR`).
- Em refatorações visuais, **nunca** remova os `useState` originais, callbacks ou propriedades atreladas às regras do painel (ex: isVIP, opções de encaixe inteligente).