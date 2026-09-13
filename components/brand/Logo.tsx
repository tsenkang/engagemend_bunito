import Image from 'next/image';

import logo from '@/public/logo.png';

type Props = {
  /** Altura do lockup em px. A largura acompanha a proporção do arquivo. */
  readonly height?: number;
  readonly priority?: boolean;
  readonly className?: string;
};

/** Proporção real do arquivo: 1178 × 405. */
const RATIO = logo.width / logo.height;

/**
 * A marca, do arquivo original, sem uma única alteração.
 *
 * Ela é desenhada em creme sobre fundo escuro: as letras somem em
 * qualquer superfície clara. Por isso **só pode ser usada sobre `ink`**
 * — é o motivo de o header e o rodapé serem blocos escuros.
 *
 * O `alt` fica vazio de propósito: o link que envolve a marca já se
 * anuncia, e um alt aqui faria o leitor de tela repetir o nome.
 */
export function Logo({ height = 34, priority = false, className }: Props) {
  return (
    <Image
      src={logo}
      alt=""
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
      className={className}
      sizes={`${Math.round(height * RATIO)}px`}
    />
  );
}
