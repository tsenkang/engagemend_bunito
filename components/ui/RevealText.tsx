import { Fragment } from 'react';

type Props = {
  readonly lines: readonly string[];
};

/**
 * Linhas quebradas em caracteres para a entrada da manchete: cada letra
 * sobe de dentro da sua linha, com atraso entre elas.
 *
 * **As letras ficam agrupadas por palavra, e isso não é organização — é
 * correção.** Cada letra é um `inline-block`, e inline-block é ponto de
 * quebra: sem o agrupamento o navegador pode partir a linha entre duas
 * letras quaisquer. Acontecia de verdade — num celular de 390px a Home
 * lia "POR FALTA D" / "E GENTE BOA.". O `.reveal-word` é `nowrap`, então
 * o único lugar por onde a linha pode partir passa a ser o espaço entre
 * palavras, que é onde uma linha deve partir.
 *
 * O espaço entre palavras é texto de verdade, não uma letra animada: ele
 * precisa continuar sendo ponto de quebra para o navegador.
 *
 * O conjunto é `aria-hidden` e quem carrega o texto para leitor de tela
 * é o `aria-label` do título — senão a leitura sairia letra por letra.
 *
 * **Sem esse `aria-label` o título fica vazio para a tecnologia
 * assistiva**, porque não sobra nada legível dentro dele. Quem usar
 * este componente precisa pôr o `aria-label` no `<h1>`; as três rotas
 * e a 404 põem.
 * O texto continua inteiro no HTML, então o buscador lê normalmente.
 *
 * Sem JavaScript tudo já está na posição final: quem esconde é o GSAP,
 * em tempo de execução, nunca o CSS.
 */
export function RevealText({ lines }: Props) {
  return (
    <span aria-hidden="true">
      {lines.map((line) => (
        <span key={line} className="reveal-line">
          <span className="reveal-inner">
            {line.split(' ').map((word, wordIndex) => (
              <Fragment key={`${line}-${wordIndex}`}>
                {wordIndex > 0 ? ' ' : null}
                <span className="reveal-word">
                  {Array.from(word).map((character, index) => (
                    <span
                      key={`${line}-${wordIndex}-${index}`}
                      className="reveal-char"
                      data-reveal-char=""
                    >
                      {character}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
