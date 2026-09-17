import { ArrowRevealButton } from '@/components/ui/ArrowRevealButton';
import { ContactFallback } from '@/components/ui/ContactFallback';
import { PixelDissolve } from '@/components/ui/PixelDissolve';
import { home, labels } from '@/lib/content';

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
      className="relative overflow-hidden bg-accent py-12 text-ink md:py-20"
    >
      <PixelDissolve tone="ink" />

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
            <ArrowRevealButton href={home.contact.cta.href}>
              {home.contact.cta.label}
            </ArrowRevealButton>

            <ContactFallback />
          </div>
        </div>
      </div>
    </section>
  );
}
