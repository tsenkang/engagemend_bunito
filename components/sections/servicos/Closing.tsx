import { ArrowRevealButton } from '@/components/ui/ArrowRevealButton';
import { PixelDissolve } from '@/components/ui/PixelDissolve';
import { labels, servicos, site } from '@/lib/content';

/** Mesmo fecho da Home: o bloco de mostarda ocupando a tela inteira. */
export function Closing() {
  return (
    <section
      data-accent=""
      className="relative overflow-hidden bg-accent py-12 text-ink md:py-20"
    >
      <PixelDissolve tone="ink" />

      <div className="shell-wide">
        <p className="label text-ink" data-enter="">
          {labels.servicosClosing}
        </p>

        <h2 className="display d-giant mt-5 md:mt-8" data-enter="">
          {servicos.closing.headline}
        </h2>

        <div
          className="mt-10 flex flex-col gap-6 border-t border-ink/25 pt-8 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-12"
          data-enter=""
        >
          <p className="max-w-measure text-18 md:text-20">{servicos.closing.body}</p>

          <div className="shrink-0">
            <ArrowRevealButton href={servicos.closing.cta.href} external>
              {servicos.closing.cta.label}
            </ArrowRevealButton>

            <p className="mt-4 text-16 text-ink">
              ou escreva para{' '}
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-touch items-center font-medium text-ink underline decoration-ink/50 transition-colors duration-200 ease-out hover:decoration-ink motion-reduce:transition-none"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
