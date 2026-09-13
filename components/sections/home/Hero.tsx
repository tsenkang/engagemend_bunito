import { Button } from '@/components/ui/Button';
import { RevealText } from '@/components/ui/RevealText';
import { home, labels } from '@/lib/content';

/**
 * Primeira tela inteira: rótulos no topo, manchete no meio, chamada na
 * base. A manchete é Archivo em caixa alta com o eixo de largura
 * fechado — é o que permite uma frase de 32 caracteres ocupar 118px sem
 * estourar a margem.
 *
 * O texto continua em caixa normal no `content.ts`; quem sobe para
 * maiúscula é o CSS. Assim a copy segue revisável do jeito que ele
 * escreveu, e o leitor de tela não soletra as palavras.
 */
export function Hero() {
  return (
    <section className="texture hero-fold shell-wide flex flex-col justify-between gap-6 pb-8 pt-5 md:gap-5 md:pb-8 md:pt-5">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink/16 pb-4">
        <p className="label flex items-center gap-2 text-ink/70">
          <span className="marquee-dot" aria-hidden="true" />
          {labels.heroLeft}
          <span className="hidden md:inline">· {labels.heroRight}</span>
        </p>
        <p className="label text-ink/70" aria-hidden="true">
          {labels.scroll} ↓
        </p>
      </div>

      <h1 className="display d-hero" data-reveal="" aria-label={home.hero.headline.join(' ')}>
        <RevealText lines={home.hero.headline} />
      </h1>

      <div
        className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8"
        data-hero-follow=""
      >
        <p className="max-w-[48ch] text-18 md:col-span-6 md:text-20">{home.hero.lead}</p>

        <div className="md:col-span-5 md:col-start-8 md:justify-self-end">
          <Button href={home.hero.cta.href}>{home.hero.cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
