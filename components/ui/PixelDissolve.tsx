/**
 * Colunas e linhas da grade. O `Motion` precisa das duas para escalonar a
 * saída dos blocos na ordem certa, então elas saem daqui e de nenhum
 * outro lugar — grade e escalonamento têm que falar do mesmo retângulo.
 */
export const DISSOLVE_COLS = 14;
export const DISSOLVE_ROWS = 4;

type Tone = 'base' | 'ink' | 'accent';

/**
 * Tailwind lê as classes do código como texto, então `bg-${tone}` não
 * existiria na folha final. O mapa deixa as três escritas por extenso.
 */
const TONE: Record<Tone, string> = {
  base: 'bg-base',
  ink: 'bg-ink',
  accent: 'bg-accent',
};

/**
 * Costura entre seções, trazida do site anterior da EngageMend (a pasta
 * `site da engagemend (do zip)`, componente `PixelDissolve`).
 *
 * Uma grade de blocos na cor da seção **de cima** cobre o topo da seção
 * de baixo e derrete quadrado a quadrado, em ordem aleatória, conforme o
 * scroll cruza a fronteira. A cor que sai é a que o visitante acabou de
 * deixar para trás: nenhuma cor nova entra no site por causa do efeito.
 *
 * O `tone` é sempre o fundo da seção anterior — é o que faz a costura
 * parecer o fim de uma seção, e não o começo de outra.
 *
 * Aqui ela é componente de servidor e marca os blocos com `data-` para o
 * `Motion` achar, como todo o resto deste site. No site anterior o
 * componente carregava o próprio `useLayoutEffect` e o próprio
 * ScrollTrigger.
 *
 * **Quem esconde os blocos é o GSAP, mas com duas exceções que são CSS:**
 * sem JavaScript e com `prefers-reduced-motion`, o `Motion` nunca roda e a
 * grade ficaria cobrindo o topo da seção para sempre. Nesses dois casos
 * ela some por folha de estilo — o `<noscript>` do layout e a regra de
 * movimento reduzido no `globals.css`.
 */
export function PixelDissolve({ tone }: { tone: Tone }) {
  return (
    <div
      aria-hidden="true"
      data-dissolve=""
      className="dissolve pointer-events-none absolute inset-x-0 top-0 z-20 grid h-20 md:h-28"
      style={{
        gridTemplateColumns: `repeat(${DISSOLVE_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${DISSOLVE_ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: DISSOLVE_COLS * DISSOLVE_ROWS }).map((_, index) => (
        <span key={index} data-dissolve-tile="" className={TONE[tone]} />
      ))}
    </div>
  );
}
