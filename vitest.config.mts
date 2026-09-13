import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Test runner separado do Playwright (que é e2e contra servidor real, ver
// tests/onboarding.spec.ts). Vitest cobre unidade + componente em isolamento
// (sem servidor nem banco) — não existia nenhum antes desta task.
//
// environment: happy-dom, não jsdom — jsdom 27 puxa @csstools/css-calc (ESM
// puro) via uma dependência CJS (@asamuzakjp/css-color), e o pool padrão do
// Vitest carrega dependências via require(), que quebra em ERR_REQUIRE_ESM
// nessa combinação de versões. happy-dom não tem essa cadeia de dependência.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
