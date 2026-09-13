/**
 * A seta dos CTAs. O briefing escreve `→` como glifo; em SVG ela tem
 * espessura constante em qualquer tamanho e não depende da fonte.
 */
export function Arrow({ className }: { readonly className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <path
        d="M3 10h13.5M11.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
