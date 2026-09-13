'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Evento que a camada de animação dispara quando o layout assenta. */
export const LAYOUT_EVENT = 'engagemend:layout';

/**
 * Elemento de assinatura: a régua da marca virando navegação.
 *
 * Filete fixo à esquerda que enche em mostarda conforme a página rola.
 * Na seção das etapas ele ganha quatro marcadores, um por etapa, que
 * acendem quando cada uma entra.
 *
 * Lê o scroll da janela direto, num `requestAnimationFrame` próprio —
 * não cria ScrollTrigger e por isso não gasta o orçamento de dois
 * `scrub` por rota que o briefing impõe.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const fillRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [marks, setMarks] = useState<readonly number[]>([]);
  const [progress, setProgress] = useState(0);

  /** Fração do documento em que cada etapa passa a ser a ativa. */
  const measure = useCallback(() => {
    const section = document.querySelector<HTMLElement>('[data-steps]');
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (!section || scrollable <= 0) {
      setMarks([]);
      return;
    }

    const steps = section.querySelectorAll('[data-step]').length;
    if (steps === 0) {
      setMarks([]);
      return;
    }

    // Com o pin, a altura da seção já inclui a distância de scrub.
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight;
    const next: number[] = [];

    for (let i = 0; i < steps; i += 1) {
      const at = top + (span * (i + 0.5)) / steps;
      next.push(Math.min(1, Math.max(0, at / scrollable)));
    }

    setMarks(next);
  }, []);

  useEffect(() => {
    const read = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, value));

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${clamped})`;
      setProgress(clamped);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(read);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    read();
    measure();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener(LAYOUT_EVENT, onResize);

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener(LAYOUT_EVENT, onResize);
    };
  }, [measure, pathname]);

  // Os marcadores só interessam perto da seção das etapas; fora dela
  // seriam quatro pontos soltos numa régua que não mede mais nada.
  const first = marks[0];
  const last = marks[marks.length - 1];
  const near =
    first !== undefined && last !== undefined && progress > first - 0.1 && progress < last + 0.1;

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail-track" />
      <div ref={fillRef} className="rail-fill" />
      {marks.map((mark) => (
        <span
          key={mark}
          className="rail-mark"
          data-near={near ? 'true' : 'false'}
          data-lit={progress >= mark ? 'true' : 'false'}
          style={{ top: `${mark * 100}%` }}
        />
      ))}
    </div>
  );
}
