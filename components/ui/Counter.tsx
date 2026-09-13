type Props = {
  readonly value: number;
  readonly suffix: string;
  /** `year` nunca leva separador de milhar: 2026 é data, não quantidade. */
  readonly kind: 'count' | 'year';
  readonly className?: string;
};

/**
 * Sem JavaScript o número já nasce no valor final. A animação da Fase 4
 * lê os `data-` e conta de zero até ele.
 */
export function Counter({ value, suffix, kind, className }: Props) {
  return (
    <span
      data-numeric
      data-counter={value}
      data-counter-kind={kind}
      data-counter-suffix={suffix}
      className={className}
    >
      {value}
      {suffix}
    </span>
  );
}
