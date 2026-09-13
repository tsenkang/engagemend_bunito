import { labels, servicos } from '@/lib/content';

/**
 * "Definido junto com a cidade" é resposta, não campo vazio: mesma cor,
 * mesmo peso e mesma posição de qualquer outro valor da lista.
 */
export function Practice() {
  return (
    <section className="texture border-y border-ink/16 py-10 md:py-16">
      <div className="shell-wide">
        <p className="label text-ink/70" data-enter="">
          {labels.servicosPractice}
        </p>

        <h2 className="display d-giant mt-5 md:mt-8" data-enter="">
          {servicos.practiceHeadline}
        </h2>

        <dl className="mt-8 border-b border-ink/16 md:mt-12">
          {servicos.practice.map((row) => (
            <div
              key={row.field}
              data-enter=""
              className="grid gap-1 border-t border-ink/16 py-4 md:grid-cols-12 md:gap-8 md:py-6"
            >
              <dt className="label pt-1 text-ink/70 md:col-span-4">{row.field}</dt>
              <dd className="max-w-measure text-18 md:col-span-8 md:text-20">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-16 text-ink/70 md:mt-6">{servicos.practiceNote}</p>
      </div>
    </section>
  );
}
