type Props = {
  /** Uma barra por linha. As quebras são desenhadas, não acaso. */
  readonly lines: readonly string[];
  /** Barra em mostarda, para quando a linha vive sobre o creme. */
  readonly accent?: boolean;
};

/**
 * Varredura de linha: uma barra sólida cobre o texto da esquerda para a
 * direita e sai pela direita, deixando a linha no lugar.
 *
 * É a direção do **Block Text Reveal do Originkit** que o Benjamin
 * mandou — portada, não copiada, como a costura de pixels, o botão de
 * agendar e o baralho antes dela. O original traz um componente de
 * cliente com `ResizeObserver`, laço de `requestAnimationFrame` próprio
 * e ouvinte de `scroll` próprio; isso seria um segundo relógio brigando
 * com o Lenis, num site que já escolheu o GSAP e foi até o fim com ele.
 *
 * Aqui é componente de servidor: **zero JavaScript**. A marcação traz
 * `data-wipe` e quem anima é o `Motion`, como todo o resto.
 *
 * **O texto é texto de verdade, inteiro, numa string só por linha.** Não
 * há divisão em palavras nem em letras, então não é preciso `aria-label`
 * de socorro, o leitor de tela lê normalmente, a seleção funciona e não
 * existe o risco de partir palavra no meio que o `RevealText` já teve.
 * A barra é o único elemento decorativo, e ela é `aria-hidden`.
 *
 * Sem JavaScript a barra fica em `scaleX(0)` e o texto se lê inteiro.
 */
export function WipeLines({ lines, accent }: Props) {
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="wipe-line">
          <span
            className={['wipe-inner', accent ? 'wipe-accent' : '']
              .filter(Boolean)
              .join(' ')}
          >
            {/*
              O texto mora num elemento só dele, e isso é necessário: a
              barra é filha do `.wipe-inner`, então apagar o contêiner
              apagaria a barra junto — não sobraria nada para cobrir a
              linha. Quem some e volta é este `<span>`, nunca o pai.
            */}
            <span data-wipe-text="">{line}</span>
            <span className="wipe-bar" data-wipe-bar="" aria-hidden="true" />
          </span>
        </span>
      ))}
    </>
  );
}
