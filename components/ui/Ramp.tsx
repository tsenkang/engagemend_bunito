type Props = {
  /** Quantos pontos. A rampa cresce do primeiro ao último. */
  readonly count?: number;
  readonly className?: string;
};

/**
 * Rampa ascendente: pontos que crescem da esquerda para a direita, o
 * último em mostarda.
 *
 * É o motivo geométrico do site — crescimento medido —, não a marca.
 * A logo continua sendo só o arquivo em `public/logo.png`, intocada.
 *
 * Sem JavaScript é uma rampa parada, que já se lê. Com ele, os pontos
 * sobem um a um quando a divisória entra na tela.
 */
export function Ramp({ count = 7, className }: Props) {
  return (
    <div
      className={['ramp', className].filter(Boolean).join(' ')}
      data-ramp=""
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="ramp-dot"
          data-ramp-dot=""
          style={{
            width: `${6 + index * 3}px`,
            height: `${6 + index * 3}px`,
            opacity: 0.25 + (index / (count - 1)) * 0.75,
          }}
        />
      ))}
    </div>
  );
}
