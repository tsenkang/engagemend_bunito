'use client';

import { gsap } from 'gsap';
import { useRef, useState } from 'react';

import { Logo } from '@/components/brand/Logo';
import { DURATION, EASE, PRELOADER_KEY, PRELOADER_MAX_MS, prefersReducedMotion } from '@/lib/animations';
import { markReady } from '@/lib/ready';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

/**
 * 1. Cortina de abertura, só na primeira visita da sessão.
 *
 * Três salvaguardas, porque uma cortina presa esconde o site inteiro:
 *
 * - vem no HTML do servidor para não piscar, mas um `<noscript>` a
 *   remove — sem JavaScript ela nunca sairia sozinha;
 * - um script mínimo no `<body>` marca a visita repetida antes da
 *   primeira pintura, então quem volta não vê nem um quadro dela;
 * - uma animação de CSS a apaga em 2,2s aconteça o que acontecer, caso
 *   o JavaScript quebre no meio.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;

    const visited = (() => {
      try {
        return window.sessionStorage.getItem(PRELOADER_KEY) === '1';
      } catch {
        return false;
      }
    })();

    try {
      window.sessionStorage.setItem(PRELOADER_KEY, '1');
    } catch {
      /* modo privado: sem memória de visita, a cortina só aparece de novo. */
    }

    if (!element || visited || prefersReducedMotion()) {
      setDone(true);
      markReady();
      return;
    }

    const counter = { value: 0 };
    const start = performance.now();

    const timeline = gsap.timeline({
      onComplete: () => {
        setDone(true);
        markReady();
      },
    });

    timeline
      .to(counter, {
        value: 100,
        duration: (PRELOADER_MAX_MS - 700) / 1000,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (number.current) number.current.textContent = Math.round(counter.value) + '%';
        },
      })
      .to(element, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: DURATION.curtain + 0.3,
        ease: EASE.curtain,
      });

    return () => {
      timeline.kill();
      // Se a rota trocar no meio, a promessa não pode ficar pendurada.
      if (performance.now() - start < PRELOADER_MAX_MS) markReady();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="preloader on-ink"
      aria-hidden="true"
      // A cortina cobre o conteúdo, mas não o esconde do leitor de tela
      // nem do buscador: o HTML abaixo dela está inteiro no documento.
    >
      <Logo height={72} className="h-7 w-auto md:h-9" />
      <span ref={number} className="preloader-count font-display" data-numeric>
        0%
      </span>
    </div>
  );
}
