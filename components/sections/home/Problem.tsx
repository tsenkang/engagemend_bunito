import { FillText } from '@/components/ui/FillText';
import { Ramp } from '@/components/ui/Ramp';
import { home, labels } from '@/lib/content';

/**
 * A pergunta ocupa a largura inteira em display; as três respostas
 * descem recuadas à direita, atrás de um filete de mostarda, para o
 * bloco ler como resposta e não como mais um parágrafo solto.
 */
export function Problem() {
  return (
    <section className="texture border-b border-ink/16 py-10 md:py-16">
      <div className="shell-wide" data-skew="">
        <div className="flex items-end gap-6">
          <p className="label text-ink/70" data-enter="">
            {labels.problem}
          </p>
          <Ramp count={6} className="hidden md:flex" />
        </div>

        <h2 className="display d-section lines mt-5 md:mt-8" data-enter="">
          {home.problem.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="mt-10 md:mt-16 md:grid md:grid-cols-12">
          <div className="border-l-2 border-accent pl-4 md:col-span-7 md:col-start-6 md:pl-6">
            <div className="max-w-measure space-y-5 text-18 md:text-20" data-fill-group="">
              {home.problem.paragraphs.map((paragraph) => (
                <FillText key={paragraph} text={paragraph} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
