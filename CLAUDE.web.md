# Syncro — Web (frontend)

Next.js (App Router) + React + TypeScript + Tailwind + Framer Motion + React Query +
Lucide React + shadcn/ui.

Leia também o `CLAUDE.md` da raiz: ele tem a **lógica de negócio protegida** e as
armadilhas gerais do projeto.

---

## Comandos

```bash
npm run dev
npm run build      # SEMPRE rodar antes de considerar uma tarefa concluída
npm run lint
```

## ⚠️ Rodar localmente: leia antes

**`src/lib/api.ts` tem um fallback para produção:**
```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.meusyncro.com.br";
```

Sem `NEXT_PUBLIC_API_URL` no `.env.local`, o dev aponta silenciosamente para a **API de
produção** — o banco das clientes reais. Isso já aconteceu e custou horas de debug.

Em dev, o `.env.local` precisa de:
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```
Variáveis `NEXT_PUBLIC_*` são lidas no boot — reinicie o `npm run dev` e faça login de novo
(o token de produção não vale no local).

**Sempre confirme no DevTools que as requisições vão para `localhost:3333`** antes de dar
qualquer bug como reproduzido.

---

## Identidade visual — "Dark & Tech / Autoridade Minimalista"

Referência: Vercel, Stripe, Linear. **Não** é o software colorido e infantil típico do
mercado de beleza. A cliente deve sentir que comprou uma ferramenta de elite.

- **Fundo:** `zinc-900` / `zinc-950`
- **Bordas:** `zinc-800` (sutis)
- **Tipografia:** sans-serif limpa. Títulos `text-zinc-100`, secundário `text-zinc-400`
- **Raio:** `rounded-xl` / `rounded-2xl`
- **Glassmorphism:** apenas em modais, dropdowns e overlays
  (`bg-zinc-900/80 backdrop-blur-xl`)
- **Framer Motion:** `spring`, damping alto (≈30), stiffness ≈320. Rápido e profissional.
  Sem bounce exagerado. Centralize constantes de spring, não espalhe props.
- **Dark mode é o padrão**, não uma variante.

**Mobile primeiro.** O público configura o sistema no celular, entre atendimentos.
Layouts de duas colunas não cabem — no mobile, prefira single-pane com navegação
explícita. Teste sempre em **375px**: se o CTA principal exigir rolagem, está errado.

---

## Estado do servidor vem do servidor

**`localStorage` não é fonte da verdade para nada que exista no banco.** O onboarding antigo
marcava passos como concluídos no *clique do botão*, não quando a ação acontecia — o
sistema "achava" que a cliente tinha serviços cadastrados quando ela só tinha visitado a
página.

Regra: derive o estado de React Query, sempre. `localStorage` só para preferência de UI
efêmera (ex.: "dismissed").

### Invalidação de query é obrigatória

Toda mutation **precisa** invalidar as queries que ela afeta. Sem isso o cache serve dados
velhos e a UI não reflete o que aconteceu — a cliente cadastra um serviço e ele não aparece
até dar F5.

**Exporte a queryKey de um único lugar e importe nos hooks de mutation.** Nunca redigite a
key à mão — foi assim que elas divergiram (`["services"]` vs `["services","me"]`) e a
invalidação parou de funcionar silenciosamente.

### Não presuma o formato do payload

Confira o que cada endpoint devolve de verdade antes de escrever o derive. Já houve bug de
ler `services.total` num endpoint que devolvia array puro — `undefined` para sempre, sem
erro nenhum.

---

## Estrutura

`src/features/{dominio}/{components,hooks,config,types}`

Features existentes: `settings`, `services`, `business-hours`, `team`, `whatsapp`,
`onboarding`.

## Onboarding

`features/onboarding/` — wizard modal que ativa a conta nova. 7 passos, progresso
**derivado do backend** (`use-onboarding-status.ts`), nunca de `localStorage`.

- `required: boolean` controla só o bloqueio do "Minimizar" (`isMinimumReady`)
- `badge?: string` é o rótulo na trilha. **Só "Equipe" leva "Opcional".** O Escudo
  Anti-Faltas leva "Recomendado" — chamá-lo de opcional sabota a proposta de valor
  do produto.
- Erro de rede (ex.: WhatsApp fora do ar) fica **contido no card**, nunca trava o wizard.

**Dívida conhecida:** existe um tour do `driver.js` (`use-product-tour.ts`, disparado em
`dashboard/page.tsx`) que colide com o wizard no primeiro acesso. Ordem correta seria:
primeiro ativar (wizard), depois aprender a navegar (tour).

## Convenções

- Early returns. Evitar aninhamento profundo, callback hell e prop drilling.
- Componentes pequenos e modulares.
- Tailwind limpo, classes agrupadas por função.
- Em refatoração de UI: preservar **todos** os `useState`, chamadas de API e props originais.
- Sem `console.log` em código commitado.