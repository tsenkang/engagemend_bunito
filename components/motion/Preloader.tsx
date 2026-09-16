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

    const start = performance.now();

    const timeline = gsap.timeline({
      onComplete: () => {
        setDone(true);
        markReady();
      },
    });

    /**
     * A cortina só entra depois que a rampa terminou de se montar.
     *
     * Os 500ms de espera não são chute: a bolinha pousa de 80 em 80ms
     * (são cinco pousos, 320ms) e o último ponto leva 180ms para nascer
     * — 500ms cravados. Somados aos 700ms da cortina dão o teto de 1,2s
     * que o briefing impõe ao preloader.
     *
     * **A rampa é CSS puro.** O GSAP aqui só espera e puxa a cortina; o
     * tween do contador que existia neste lugar saiu e nada entrou no
     * lugar dele, então este componente ficou mais leve do que era.
     */
    timeline.to(
      element,
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: DURATION.curtain + 0.3,
        ease: EASE.curtain,
      },
      (PRELOADER_MAX_MS - 700) / 1000,
    );

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

      {/*
        A rampa da marca sendo construída: a bolinha mostarda pula de
        ponto em ponto e acende cada um ao pousar. No último pulo ela
        encolhe a zero enquanto o ponto mostarda nasce no lugar dela —
        a bolinha não sai de cena, ela vira a ponta da rampa.

        Cinco pontos fixos, e é de propósito: os tamanhos, os intervalos
        e os quadros do pulo são a mesma medida. Trocar a quantidade
        aqui pede refazer `preloader-ball-hop` no `globals.css`.

        Toda a animação é CSS. Não há estado, não há ref, não há tween.
      */}
      <span className="preloader-ramp">
        <span className="preloader-dot" />
        <span className="preloader-dot" />
        <span className="preloader-dot" />
        <span className="preloader-dot" />
        <span className="preloader-dot" />
        <span className="preloader-ball" />
      </span>
    </div>
  );
}
