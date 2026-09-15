import { PixelDissolve } from '@/components/ui/PixelDissolve';
import { home, labels, servicos, steps } from '@/lib/content';

/**
 * As quatro etapas num **baralho**: o cartão da frente sai na mão, os de
 * trás aparecem recuados atrás dele. Dois jeitos de conduzir — arrastar
 * o cartão ou clicar numa etapa no atalho —, e os dois mexem no mesmo
 * índice. Não há estado paralelo para dessincronizar.
 *
 * Sem JavaScript (e para quem pede menos movimento) o baralho não
 * existe: os quatro cartões são uma lista, um debaixo do outro, com o
 * método inteiro legível de uma vez. É o layout base, não um plano B —
 * quem empilha é o `Motion`, em tempo de execução, e as âncoras do
 * atalho continuam pulando para o cartão certo.
 */
export function Method() {
  return (
    <section
      className="texture texture-light on-ink relative overflow-hidden bg-ink text-base"
      data-steps=""
      data-dark=""
    >
      <PixelDissolve tone="base" />

      <div className="steps-stage shell-wide">
        <div className="steps-intro">
          <p className="label text-base/60">{labels.method}</p>

          <h2 className="display d-section max-w-[20ch]">
            {home.method.headline}
          </h2>

          {/*
            Atalho para as quatro etapas, e o jeito de conduzir o baralho
            sem depender do arrasto — teclado inclusive. São âncoras de
            verdade: sem JavaScript elas pulam para o cartão, que é o
            comportamento certo. Com JavaScript o `Motion` intercepta e
            traz a etapa para a frente.

            Nada aqui inventa texto: numeral e título saem do `content.ts`,
            e o rótulo do bloco é a mesma frase que `/servicos` já usa
            ("As quatro etapas").
          */}
          <nav
            className="steps-nav"
            aria-label={servicos.stepsHeadline}
            data-steps-nav=""
          >
            <ul>
              {steps.map((step, index) => (
                <li key={step.numeral}>
                  <a href={`#etapa-${step.numeral}`} data-step-to={index}>
                    <span className="steps-nav-num" data-numeric>
                      {step.numeral}
                    </span>
                    <span className="steps-nav-title display display-caps">
                      {step.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Quanto do método já passou. Decorativo: o estado real está
                no `aria-current` de cada âncora. */}
            <span className="steps-progress" aria-hidden="true">
              <span data-steps-progress="" />
            </span>
          </nav>
        </div>

        <div className="deck" data-deck="">
          <ol className="deck-cards">
            {steps.map((step) => (
              <li
                key={step.numeral}
                id={`etapa-${step.numeral}`}
                data-step=""
                className="panel deck-card flex flex-col rounded p-6 md:p-8"
              >
                <span className="label text-accent" data-numeric>
                  {step.numeral}
                </span>

                <h3 className="display display-caps step-title">
                  {step.title}
                </h3>

                <p className="mt-4 text-16 text-base/70 md:text-18">{step.body}</p>
              </li>
            ))}
          </ol>

          {/*
            Instrução de uso, não conteúdo — e por isso só aparece quando
            existe o que arrastar: quem a mostra é o `data-on` que o
            `Motion` põe no baralho. Sem JavaScript ela não está lá.
          */}
          <p className="label deck-hint text-base/60" aria-hidden="true">
            Arraste os cartões
          </p>
        </div>
      </div>
    </section>
  );
}
