'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';

import { prefersReducedMotion } from '@/lib/animations';
import { setLenis } from '@/lib/lenis';

/**
 * Lenis e GSAP no mesmo relógio.
 *
 * Sem isso os dois brigam: o Lenis move o scroll fora do frame do GSAP e
 * os pontos de disparo do ScrollTrigger ficam sempre um quadro atrás.
 * `lagSmoothing(0)` impede o GSAP de "recuperar" tempo perdido e dar um
 * salto no scroll quando a aba volta do segundo plano.
 *
 * Com `prefers-reduced-motion` o Lenis simplesmente não sobe: o scroll
 * volta a ser o nativo do navegador.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setLenis(lenis);

    const update = () => ScrollTrigger.update();
    lenis.on('scroll', update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Os pontos de disparo só valem depois que as fontes trocam.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off('scroll', update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
