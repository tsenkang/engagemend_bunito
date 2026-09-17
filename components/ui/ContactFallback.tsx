import { contactSupport, site } from '@/lib/content';

/**
 * O apoio embaixo do botão de agendar: o que o clique faz, o endereço
 * legível e o Gmail como atalho.
 *
 * O porquê de o endereço ser texto e não link está no `contactSupport`.
 * A marcação estava duplicada palavra por palavra na Home e no
 * `ScheduleBlock` — dois lugares que envelhecem separados, e o bloco
 * mais caro do site para envelhecer errado.
 *
 * `select-all` faz o clique no endereço selecionar ele inteiro, em vez
 * de plantar um cursor no meio: quem vai copiar copia de primeira. É
 * CSS, não JavaScript.
 */
export function ContactFallback() {
  return (
    <div className="mt-4 max-w-measure space-y-1 text-16 text-ink">
      <p>{contactSupport.note}</p>
      <p>
        {contactSupport.fallbackPrefix}{' '}
        <span className="select-all font-medium">{site.email}</span>
        <span aria-hidden="true"> · </span>
        <a
          href={site.compose}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-touch items-center font-medium text-ink underline decoration-ink/50 transition-colors duration-200 ease-out hover:decoration-ink motion-reduce:transition-none"
        >
          {contactSupport.gmailLabel}
        </a>
      </p>
    </div>
  );
}
