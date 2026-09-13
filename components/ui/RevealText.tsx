type Props = {
  readonly lines: readonly string[];
};

/**
 * Linhas quebradas em caracteres para a entrada da manchete: cada letra
 * sobe de dentro da sua linha, com atraso entre elas.
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
            {Array.from(line).map((character, index) => (
              <span
                key={`${line}-${index}`}
                className="reveal-char"
                data-reveal-char=""
              >
                {character === ' ' ? ' ' : character}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
