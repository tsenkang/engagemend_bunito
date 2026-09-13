'use client';

import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { DURATION, EASE, prefersReducedMotion } from '@/lib/animations';

/** Se a rota não chegar nesse tempo, a cortina sai sozinha. */
const SAFETY_MS = 1600;

/**
 * 12. Transição entre rotas: a cortina `ink` sobe cobrindo a página,
 * a rota troca por baixo, e ela continua subindo para revelar a nova.
 *
 * O clique é interceptado à mão porque o App Router troca a rota no
 * mesmo quadro, sem dar tempo de animar a saída. Só clique simples com
 * o botão esquerdo entra aqui: ctrl, cmd, shift, botão do meio e
 * `target="_blank"` seguem o caminho normal do navegador, senão abrir em
 * nova aba pararia de funcionar.
 */
export function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const link = target?.closest?.('a');
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      const element = curtain.current;
      if (!element || covering.current) return;

      event.preventDefault();
      covering.current = true;

      gsap.set(element, { display: 'block', transformOrigin: 'bottom center' });
      gsap.fromTo(
        element,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: DURATION.curtain,
          ease: EASE.curtain,
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );

      window.setTimeout(() => {
        if (covering.current) reveal(element, covering);
      }, SAFETY_MS);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (prefersReducedMotion()) return;

    const element = curtain.current;
    if (!element) return;

    window.scrollTo(0, 0);
    reveal(element, covering);
  }, [pathname]);

  return <div ref={curtain} className="route-curtain" aria-hidden="true" />;
}

function reveal(element: HTMLElement, covering: { current: boolean }) {
  covering.current = false;

  gsap.set(element, { display: 'block', transformOrigin: 'top center', scaleY: 1 });
  gsap.to(element, {
    scaleY: 0,
    duration: DURATION.curtain,
    ease: EASE.curtain,
    onComplete: () => gsap.set(element, { display: 'none' }),
  });
}
