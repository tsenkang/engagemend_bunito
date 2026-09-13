import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { footer } from '@/lib/content';

/**
 * Bloco escuro de largura total, par do header: fecha a página com a
 * marca no fundo para o qual ela foi desenhada.
 */
export function Footer() {
  return (
    <footer className="on-ink bg-ink text-base">
      <div className="shell-wide py-10 md:py-15">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="max-w-[46ch]">
            <Link
              href="/"
              aria-label="EngageMend, página inicial"
              className="-mx-1 inline-flex min-h-touch items-center rounded px-1 transition-opacity duration-200 ease-out hover:opacity-80"
            >
              <Logo height={56} className="h-6 w-auto md:h-7" />
            </Link>
            <p className="mt-3 text-18 text-base/70">{footer.tagline}</p>
          </div>

          <nav aria-label="Contato e redes sociais" className="shrink-0">
            <ul className="flex flex-col gap-1 md:items-end">
              {footer.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group inline-flex min-h-touch min-w-touch items-center rounded text-18 font-medium md:justify-end"
                  >
                    <span className="relative">
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -bottom-half h-hair origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-base/20 pt-4 text-14 text-base/70 md:mt-12">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
