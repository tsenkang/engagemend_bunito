import { RevealText } from '@/components/ui/RevealText';
import { labels, sobre } from '@/lib/content';

export function Intro() {
  return (
    <section className="texture shell-wide pb-10 pt-6 md:pb-16 md:pt-8">
      <div className="flex items-center gap-2 border-b border-ink/16 pb-4">
        <span className="marquee-dot" aria-hidden="true" />
        <p className="label text-ink/70">{labels.sobre}</p>
      </div>

      <h1
        className="display d-hero mt-8 md:mt-12"
        data-reveal=""
        aria-label={sobre.headline.join(' ')}
      >
        <RevealText lines={sobre.headline} />
      </h1>

      <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:gap-8">
        <p className="max-w-measure text-20 md:col-span-6 md:text-24" data-enter="">
          {sobre.lead}
        </p>

        <div
          className="max-w-measure space-y-5 text-18 text-ink/70 md:col-span-5 md:col-start-8 md:text-20"
          data-enter=""
        >
          {sobre.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
