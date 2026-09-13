import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Sem `test.globals: true` no vitest.config.mts, o auto-cleanup implícito do
// Testing Library entre testes não dispara — cada render() empilhava no
// mesmo DOM e todo `getBy*` batia em "multiple elements found".
afterEach(() => {
  cleanup();
});

// O Framer Motion (usado em StepBilling) cancela a Web Animations API no
// unmount. A implementação de `animate()` do happy-dom é fiel ao spec e
// rejeita a promise `finished` com AbortError nesse cancel — mas o Framer
// Motion não dá catch nesse caminho, então vira unhandled rejection e derruba
// a suíte inteira (exit code 1) mesmo com todo `expect()` passando. Stub
// mínimo: sem timeline real, sem promise rejeitada.
if (typeof Element !== "undefined") {
  Element.prototype.animate = function animate() {
    return {
      onfinish: null,
      oncancel: null,
      finished: Promise.resolve(),
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      addEventListener() {},
      removeEventListener() {},
    } as unknown as Animation;
  };
}
