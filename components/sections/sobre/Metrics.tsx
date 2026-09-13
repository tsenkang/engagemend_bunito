import { Counter } from '@/components/ui/Counter';
import { labels, sobre } from '@/lib/content';

/**
 * Três números, um filete entre cada. É a única prova objetiva da
 * página, então ganha uma faixa própria e o tamanho de display.
 */
export function Metrics() {
  return (
    <section className="texture border-y border-ink/16 py-10 md:py-16" data-metrics="">
      <div className="shell-wide">
        <p className="label text-ink/70">{labels.metrics}</p>

        <dl className="mt-8 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-0">
          {sobre.metrics.map((metric, index) => (
            <div
              key={metric.label}
              data-enter=""
              className={[
                'border-t border-ink/16 pt-6 md:pt-8',
                index > 0 ? 'md:border-l md:pl-8' : '',
                index < sobre.metrics.length - 1 ? 'md:pr-8' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <dd className="display text-72 leading-none md:text-112">
                <Counter value={metric.value} suffix={metric.suffix} kind={metric.kind} />
              </dd>
              <dt className="mt-4 max-w-[22ch] text-18 text-ink/70">{metric.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
