import { labels, servicos, steps } from '@/lib/content';

/**
 * As mesmas quatro etapas da Home, vindas do mesmo objeto — outro
 * arranjo, nunca outro texto. Na Home o numeral é o peso da linha; aqui
 * ele vira marcador de um trilho que se desenha conforme o scroll.
 */
export function Steps() {
  return (
    <section className="shell-wide py-4 md:py-8" data-timeline="">
      <p className="label text-ink/70" data-enter="">
        {labels.servicosSteps}
      </p>

      <h2 className="display d-giant mt-5 md:mt-8">{servicos.stepsHeadline}</h2>

      <ol className="timeline mt-8 md:mt-12">
        <div className="timeline-fill" data-timeline-fill="" aria-hidden="true" />

        {steps.map((step, index) => (
          <li
            key={step.numeral}
            data-active="false"
            className={[
              'timeline-item relative',
              index < steps.length - 1 ? 'pb-8 md:pb-12' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="timeline-dot label text-ink" aria-hidden="true">
              {step.numeral}
            </span>

            <h3 className="display display-caps text-24 md:text-32">{step.title}</h3>

            <p className="mt-2 max-w-measure text-18 text-ink/70 md:mt-3 md:text-20">
              {step.body}
            </p>

            {/* O numeral está no marcador, que é decorativo: repõe para quem lê por áudio. */}
            <span className="sr-only">Etapa {step.numeral}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
