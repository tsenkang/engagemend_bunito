import type { Metadata } from 'next';
import Link from 'next/link';

import { Arrow } from '@/components/ui/Arrow';
import { Ramp } from '@/components/ui/Ramp';
import { RevealText } from '@/components/ui/RevealText';
import { notFound, site } from '@/lib/content';
import { openGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: notFound.title,
  description: notFound.lead,
  robots: { index: false, follow: true },
  openGraph: openGraph({ title: notFound.title, description: notFound.lead }),
};

/**
 * A página de erro é a única do site que abre no escuro, e isso é o
 * recado: você saiu do caminho. Ela usa o mesmo enquadramento do hero
 * da Home — régua de rótulos em cima, manchete no meio, chamada na
 * base —, para o visitante reconhecer onde está mesmo estando perdido.
 *
 * O texto é sinalização, não marketing: diz o que houve e devolve o
 * visitante às três rotas que existem.
 *
 * **A lista de rotas fica fora do bloco escuro de propósito.** O bloco
 * abre com `clip-path` do GSAP (`data-dark`), e num site inteiro isso é
 * um risco aceito; aqui não seria, porque é justamente esta página que
 * precisa funcionar quando algo já deu errado. A saída mora na seção de
 * baixo, que nada esconde.
 */
export default function NotFoundPage() {
  return (
    <>
      <section
        className="texture texture-light on-ink bg-ink text-base"
        data-dark=""
      >
        <div className="shell-wide flex min-h-[66svh] flex-col justify-between gap-8 pb-10 pt-5 md:min-h-[72svh] md:gap-10">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-base/20 pb-4">
            <p className="label flex items-center gap-2 text-base/70">
              <span className="marquee-dot" aria-hidden="true" />
              {notFound.status}
            </p>
            {/* Mostarda sobre ink dá 7,2:1 — o único par em que ela passa. */}
            <p className="label text-accent">{notFound.code}</p>
          </div>

          {/**
           * O conteúdo visível é `aria-hidden` porque está quebrado em
           * letras para a entrada; quem carrega a frase para o leitor de
           * tela é o `aria-label`.
           */}
          <h1
            className="display d-notfound"
            data-reveal=""
            aria-label={notFound.headline.join(' ')}
          >
            <RevealText lines={notFound.headline} />
          </h1>

          <div
            className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8"
            data-hero-follow=""
          >
            <p className="max-w-[48ch] text-18 text-base/70 md:col-span-7 md:text-20">
              {notFound.lead}
            </p>

            <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
              <Ramp count={7} />
              <p className="label mt-3 text-base/70" aria-hidden="true">
                {notFound.scroll} ↓
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="texture shell-wide py-12 md:py-20">
        <div className="flex items-end justify-between gap-6 border-b border-ink/16 pb-4">
          <p className="label text-ink/70">{notFound.routesLabel}</p>
          <Ramp count={6} className="hidden md:flex" />
        </div>

        <ul>
          {notFound.routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="group relative grid min-h-touch grid-cols-1 gap-x-6 gap-y-2 border-b border-ink/16 py-6 md:grid-cols-12 md:items-center md:py-8"
                data-enter=""
              >
                {/**
                 * A mostarda entra como filete, nunca como texto: sobre
                 * o creme ela dá 1,95:1 e reprova em qualquer tamanho.
                 */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-hair origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />

                <span className="label text-ink/70 md:col-span-1" data-numeric>
                  {route.numeral}
                </span>

                {/**
                 * O crescendo é medido, não escolhido: "SERVIÇOS" a
                 * 'wdth' 86 pede 4,619px de largura por 1px de corpo, e
                 * a coluna de 4 só comporta os 333px do corpo 72 a
                 * partir de 1280px. Abaixo disso ela transbordaria.
                 */}
                <span className="display display-caps text-32 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none md:col-span-4 lg:text-48 xl:text-72">
                  {route.label}
                </span>

                <span className="max-w-measure text-18 text-ink/70 md:col-span-6">
                  {route.body}
                </span>

                <Arrow
                  className="hidden transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none md:col-span-1 md:block md:justify-self-end"
                />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-18 text-ink/70 md:mt-10">
          {notFound.helpPrefix}{' '}
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-touch items-center font-medium text-ink underline decoration-ink/40 transition-colors duration-200 ease-out hover:decoration-ink motion-reduce:transition-none"
          >
            {site.email}
          </a>
        </p>
      </section>
    </>
  );
}
