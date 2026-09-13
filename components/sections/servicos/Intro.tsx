import { RevealText } from '@/components/ui/RevealText';
import { labels, servicos } from '@/lib/content';

export function Intro() {
  return (
    <section className="texture shell-wide pb-10 pt-5 md:pb-16 md:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink/16 pb-4">
        <p className="label flex items-center gap-2 text-ink/70">
          <span className="marquee-dot" aria-hidden="true" />
          {labels.servicosSteps}
        </p>
        <p className="label text-ink/70" aria-hidden="true">
          {labels.scroll} ↓
        </p>
      </div>

      <h1
        className="display d-hero mt-8 md:mt-12"
        data-reveal=""
        aria-label={servicos.headline.join(' ')}
      >
        <RevealText lines={servicos.headline} />
      </h1>

      <div className="mt-10 grid gap-6 md:mt-16 md:grid-cols-12 md:gap-8">
        {servicos.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            data-enter=""
            className={[
              'max-w-measure text-18 md:text-20',
              index === 0 ? 'md:col-span-6' : 'md:col-span-5 md:col-start-8 md:text-ink/70',
            ].join(' ')}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
