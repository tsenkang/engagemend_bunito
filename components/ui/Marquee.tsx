type Props = {
  readonly items: readonly string[];
};

/**
 * Faixa rolante com o vocabulário da marca. A lista é duplicada e o
 * trilho anda -50%: no fim da primeira cópia a segunda está exatamente
 * onde a primeira começou, então a volta é invisível.
 *
 * `aria-hidden` porque o conteúdo aparece duas vezes no HTML — para
 * quem ouve a página, isso seria eco. As mesmas palavras já estão no
 * texto e nas keywords das rotas.
 */
export function Marquee({ items }: Props) {
  const track = [...items, ...items];

  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee">
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            <span className="display d-strip">{item}</span>
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
