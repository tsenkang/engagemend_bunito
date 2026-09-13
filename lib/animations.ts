/**
 * Durações, easings e limites de animação em um lugar só.
 *
 * Orçamento do briefing: no máximo **2 ScrollTriggers com `scrub` por
 * rota**. A barra de progresso e o parallax não entram nessa conta
 * porque leem o scroll do Lenis direto, sem criar trigger.
 */
export const DURATION = {
  /** Entrada de elemento. */
  enter: 0.55,
  /** Microinteração (hover, marcador). */
  micro: 0.2,
  /** Cortina de preloader e de troca de rota. */
  curtain: 0.4,
  /** Contador numérico. */
  counter: 1.2,
} as const;

export const EASE = {
  enter: 'expo.out',
  curtain: 'power3.inOut',
  counter: 'power2.out',
} as const;

/** Intervalo entre elementos de uma mesma entrada. */
export const STAGGER = 0.07;

/** Teto do preloader, contando do início do carregamento. */
export const PRELOADER_MAX_MS = 1200;

export const PRELOADER_KEY = 'engagemend:visited';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
