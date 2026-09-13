import { Arrow } from '@/components/ui/Arrow';
import { home, labels, site } from '@/lib/content';

/**
 * O bloco de mostarda: a única vez em que a cor de destaque ocupa a tela
 * inteira, e por isso o ponto mais alto da página. Texto em `ink` sobre
 * mostarda dá 7,2:1 — a única combinação em que essa cor passa em
 * contraste, e a razão de o botão daqui ser escuro em vez de amarelo.
 */
export function Contact() {
  return (
    <section
      id={home.contact.id}
      data-accent=""
      className="bg-accent py-12 text-ink md:py-20"
    >
      <div className="shell-wide">
        <p className="label text-ink" data-enter="">
          {labels.contact}
        </p>

        <h2 className="display d-giant lines mt-5 md:mt-8" data-enter="">
          {home.contact.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div
          className="mt-10 flex flex-col gap-6 border-t border-ink/25 pt-8 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-12"
          data-enter=""
        >
          <p className="max-w-measure text-18 md:text-20">{home.contact.body}</p>

          <div className="shrink-0">
            <a
              href={home.contact.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic=""
              className="group inline-flex min-h-touch items-center gap-2 rounded bg-ink px-4 py-2 text-18 font-semibold text-base transition-[filter] duration-200 ease-out hover:brightness-110 motion-reduce:transition-none"
            >
              {home.contact.cta.label}
              <Arrow className="transition-transform duration-200 ease-out group-hover:translate-x-half motion-reduce:transition-none" />
            </a>

            <p className="mt-4 text-16 text-ink">
              {home.contact.fallbackPrefix}{' '}
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
