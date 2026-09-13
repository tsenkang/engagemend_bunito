import { Arrow } from '@/components/ui/Arrow';

type Props = {
  readonly href: string;
  readonly children: React.ReactNode;
  /** Abre em nova aba com `rel` seguro. */
  readonly external?: boolean;
  readonly className?: string;
};

/**
 * O único botão preenchido do site. Mostarda preenchida com texto `ink`
 * — 7,2:1, a única forma em que a mostarda passa em contraste.
 *
 * É um `<a>`, não um `<button>`: todo CTA daqui navega (âncora ou
 * composição do Gmail).
 */
export function Button({ href, children, external, className }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-magnetic=""
      className={[
        'group inline-flex min-h-touch items-center gap-2 rounded bg-accent px-4 py-2',
        'text-18 font-semibold text-ink',
        // O levante de 2px do hover mora no ímã (Motion.tsx), não aqui:
        // GSAP e Tailwind escreveriam `transform` um por cima do outro.
        'transition-[filter] duration-200 ease-out hover:brightness-94',
        'motion-reduce:transition-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      <Arrow className="transition-transform duration-200 ease-out group-hover:translate-x-half motion-reduce:transition-none" />
    </a>
  );
}
