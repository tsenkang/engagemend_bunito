import { Arrow } from '@/components/ui/Arrow';

type Props = {
  readonly href: string;
  readonly children: React.ReactNode;
  /** Abre em nova aba com `rel` seguro. */
  readonly external?: boolean;
};

/**
 * O CTA dos dois fechos de mostarda ("Agendar conversa").
 *
 * Em repouso é o botão escuro de sempre, com um disco creme na ponta no
 * lugar da seta solta. No ponteiro o disco cresce até inundar o botão, a
 * seta corre até o centro e o rótulo desliza para o lado enquanto some
 * debaixo do creme — é ele que o efeito revela.
 *
 * É a direção do "Arrow Reveal" que o Benjamin mandou, não o arquivo. O
 * original é Framer Motion medindo o botão com `ResizeObserver` para
 * saber de quanto escalar o disco; aqui nada disso sobe, porque o
 * `clip-path` resolve a porcentagem contra o próprio botão e 150% cobre
 * qualquer largura. Continua sendo componente de servidor, sem um byte
 * de JavaScript.
 *
 * A seta tem `aria-hidden` e o rótulo continua no DOM inteiro: quem ouve
 * a página ouve "Agendar conversa", coberto ou não.
 *
 * A mecânica mora em `.cta-reveal`, no globals.css.
 */
export function ArrowRevealButton({ href, children, external }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-magnetic=""
      className="cta-reveal text-18 font-semibold"
    >
      <span className="cta-reveal-label">{children}</span>
      <span className="cta-reveal-disc" aria-hidden="true" />
      <span className="cta-reveal-arrow" aria-hidden="true">
        <Arrow />
      </span>
    </a>
  );
}
