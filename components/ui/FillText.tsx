import { Fragment } from 'react';

type Props = {
  readonly text: string;
  readonly className?: string;
};

/**
 * Parágrafo quebrado em palavras para o preenchimento no scroll.
 *
 * Sem JavaScript, cada palavra já nasce em `ink` — a divisão é só um
 * gancho, nunca um pré-requisito para ler o texto.
 */
export function FillText({ text, className }: Props) {
  const words = text.split(' ');

  return (
    <p className={className} data-fill="">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span data-fill-word="">{word}</span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </p>
  );
}
