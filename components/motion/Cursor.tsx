'use client';

import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '@/lib/animations';

/**
 * Cursor próprio: um ponto que persegue o mouse com atraso e cresce
 * sobre o que é clicável. `mix-blend-mode: difference` faz ele inverter
 * o que estiver embaixo, então funciona no creme, no verde e na
 * mostarda sem trocar de cor.
 *
 * Não substitui o cursor do sistema — anda junto com ele. Esconder o
 * cursor nativo quebra quem depende dele para achar o ponteiro.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = dot.current;
    if (!element || prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let scale = 1;
    let scaleTarget = 1;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      // Só link e botão. O `video` já tinha saído desta lista porque o
      // disco de 2,6x pousava em cima dos controles nativos; a seção de
      // vídeo saiu inteira da Home na décima quarta passada.
      const over = (event.target as Element | null)?.closest?.('a, button');
      scaleTarget = over ? 2.6 : 1;
    };

    const frame = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      scale += (scaleTarget - scale) * 0.15;
      element.style.transform = `translate3d(${current.x - 7}px, ${current.y - 7}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <div ref={dot} className="cursor" aria-hidden="true" />;
}
