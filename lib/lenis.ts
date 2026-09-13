import type Lenis from 'lenis';

/**
 * Referência à instância única do Lenis. Existe para que a âncora
 * `#contato` role com o mesmo easing do resto do site em vez de dar um
 * salto nativo por cima dele.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
