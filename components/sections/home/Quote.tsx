import { Ramp } from '@/components/ui/Ramp';
import { home, labels } from '@/lib/content';

/**
 * Um dos dois blocos escuros do site. A textura de curvas inverte aqui
 * — traço claro sobre o verde — para o bloco não virar um retângulo
 * chapado do tamanho de uma tela.
 */
export function Quote() {
  return (
    <section
      className="texture texture-light on-ink bg-ink py-12 text-base md:py-20"
      data-dark=""
    >
      <div className="shell-wide">
        <div className="flex items-end gap-6">
          <p className="label text-base/60">{labels.quote}</p>
          <Ramp count={6} className="hidden md:flex" />
        </div>

        <blockquote className="mt-5 md:mt-8">
          <p className="display d-quote lines">
            {home.quote.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </blockquote>

        <div className="mt-10 md:mt-16 md:grid md:grid-cols-12" data-enter="">
          <p className="max-w-measure text-18 text-base/70 md:col-span-7 md:col-start-6 md:text-20">
            {home.quote.body}
          </p>
        </div>
      </div>
    </section>
  );
}
