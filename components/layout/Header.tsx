'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/brand/Logo';
import { home, nav } from '@/lib/content';

/**
 * Faixa escura de largura total. Não é decoração: a marca é creme e só
 * existe sobre fundo escuro, então o header é a superfície que ela pede.
 *
 * Dois itens de navegação não justificam um hambúrguer — os dois
 * continuam visíveis no celular. O botão de contato mora aqui em forma
 * de pílula; o briefing dizia para não pôr CTA no header, mas o site de
 * referência põe, e é a rota mais curta do visitante até a conversa.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="on-ink sticky top-0 z-30 bg-ink text-base">
      <div className="shell-wide flex h-8 items-center justify-between gap-3 md:h-9">
        <Link
          href="/"
          aria-label="EngageMend, página inicial"
          className="-mx-1 inline-flex min-h-touch shrink-0 items-center rounded px-1 transition-opacity duration-200 ease-out hover:opacity-80"
        >
          <Logo height={40} priority className="h-4 w-auto md:h-5" />
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-2 md:gap-5">
            {nav.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="group inline-flex min-h-touch min-w-touch items-center justify-center rounded px-1 text-16 font-medium"
                  >
                    {/* O sublinhado acompanha o texto, não a área de toque. */}
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={[
                          'pointer-events-none absolute inset-x-0 -bottom-half h-hair origin-left bg-accent',
                          'transition-transform duration-300 ease-out motion-reduce:transition-none',
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        ].join(' ')}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* No celular a pílula não cabe ao lado da marca e dos dois
                links; ali vale o header do briefing, sem CTA. */}
            <li className="hidden md:block">
              <a
                href={home.contact.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic=""
                className="inline-flex min-h-touch items-center rounded-full bg-accent px-3 text-14 font-semibold text-ink transition-[filter] duration-200 ease-out hover:brightness-94 md:px-4 md:text-16"
              >
                {home.contact.cta.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
