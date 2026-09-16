import { ArrowRevealButton } from '@/components/ui/ArrowRevealButton';
import { PixelDissolve } from '@/components/ui/PixelDissolve';
import { schedule, site } from '@/lib/content';

type Props = {
  /** O rótulo numerado da seção: cada rota tem a sua posição na espinha. */
  readonly label: string;
};

/**
 * O fecho de mostarda das duas rotas de dentro.
 *
 * Existia só em `/servicos`, como markup solto. `/sobre` não tinha fecho
 * nenhum: subia até "Vem de Pompeia." e entregava o visitante ao rodapé,
 * justamente onde a vontade de agir é maior e no celular não sobrava nem
 * a pílula do header. Agora as duas terminam no mesmo bloco.
 *
 * Texto em `ink` sobre mostarda dá 7,2:1 — a única combinação em que essa
 * cor passa em contraste, e a razão de o botão ser escuro e não amarelo.
 */
export function ScheduleBlock({ label }: Props) {
  return (
    <section
      data-accent=""
      className="relative overflow-hidden bg-accent py-12 text-ink md:py-20"
    >
      <PixelDissolve tone="ink" />

      <div className="shell-wide">
        <p className="label text-ink" data-enter="">
          {label}
        </p>

        <h2 className="display d-giant mt-5 md:mt-8" data-enter="">
          {schedule.headline}
        </h2>

        <div
          className="mt-10 flex flex-col gap-6 border-t border-ink/25 pt-8 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-12"
          data-enter=""
        >
          <p className="max-w-measure text-18 md:text-20">{schedule.body}</p>

          <div className="shrink-0">
            <ArrowRevealButton href={schedule.cta.href}>
              {schedule.cta.label}
            </ArrowRevealButton>

            {/*
              Duas informações que faltavam no momento de maior risco: o
              que acontece depois do clique, e a saída para quem não tem
              programa de e-mail configurado.
            */}
            <p className="mt-4 max-w-measure text-16 text-ink">
              {schedule.note} {schedule.gmailPrefix}{' '}
              <a
                href={site.compose}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-touch items-center font-medium text-ink underline decoration-ink/50 transition-colors duration-200 ease-out hover:decoration-ink motion-reduce:transition-none"
              >
                {schedule.gmailLabel}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
