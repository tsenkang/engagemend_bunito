import { home, labels, steps } from '@/lib/content';

/**
 * As quatro etapas num trilho horizontal.
 *
 * Acima de 1024px a seção trava e o scroll vertical passa a empurrar as
 * etapas de lado: o método inteiro percorrido sem sair do quadro. Abaixo
 * disso, e sem JavaScript, o trilho é uma lista que rola no dedo — o
 * layout base, não um plano B.
 */
export function Method() {
  return (
    <section
      className="texture texture-light on-ink relative overflow-hidden bg-ink text-base"
      data-steps=""
      data-dark=""
    >
      {/*
        O pin agarra esta div, nunca a <section>.
        O GSAP embrulha o alvo do pin num `pin-spacer`; se o alvo fosse a
        seção, o React perderia de vista o próprio nó na troca de rota e
        a árvore inteira quebrava ao sair da Home.
      */}
      <div className="py-10 md:py-14" data-steps-pin="">
        <div className="shell-wide">
        <p className="label text-base/60">{labels.method}</p>

          <h2 className="display d-section mt-5 max-w-[20ch] md:mt-8">
            {home.method.headline}
          </h2>
        </div>

        <div className="mt-8 md:mt-12">
          <ol
            className="track shell-wide overflow-x-auto pb-2 lg:overflow-visible"
            data-track=""
          >
            {steps.map((step) => (
              <li
                key={step.numeral}
                data-step=""
                className="panel flex min-h-[380px] flex-col rounded p-6 md:min-h-[440px] md:p-8"
              >
                <span className="label text-accent" data-numeric>
                  {step.numeral}
                </span>

                <h3 className="display display-caps mt-10 text-32 md:mt-14 md:text-48">
                  {step.title}
                </h3>

                <p className="mt-4 text-16 text-base/70 md:text-18">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
