import type { Config } from 'tailwindcss';

/**
 * Três cores e nada além disso. Toda variação é opacidade de `ink`,
 * por isso as cores saem de variáveis RGB com <alpha-value>.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // Substituições totais: a escala é fechada, não estendida.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      base: 'rgb(var(--base-rgb) / <alpha-value>)',
      ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
      accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
    },
    spacing: {
      0: '0px',
      px: '1px',
      // 2px está fora da escala de 8pt de propósito: o briefing pede
      // filete e anel de foco de 2px. É espessura de traço, não ritmo.
      hair: '2px',
      half: '4px',
      1: '8px',
      2: '16px',
      3: '24px',
      4: '32px',
      5: '40px',
      6: '48px',
      7: '56px',
      8: '64px',
      9: '72px',
      10: '80px',
      11: '88px',
      12: '96px',
      13: '104px',
      14: '112px',
      15: '120px',
      16: '128px',
      18: '144px',
      20: '160px',
      24: '192px',
      28: '224px',
      30: '240px',
    },
    fontSize: {
      12: ['12px', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      14: ['14px', { lineHeight: '1.5' }],
      16: ['16px', { lineHeight: '1.6' }],
      18: ['18px', { lineHeight: '1.6' }],
      20: ['20px', { lineHeight: '1.5' }],
      24: ['24px', { lineHeight: '1.35' }],
      32: ['32px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      // 44 e 18 não estão na lista numérica da seção 5 do briefing, mas
      // a prosa da mesma seção pede os dois (H1 mobile e corpo desktop).
      44: ['44px', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      48: ['48px', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      72: ['72px', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      112: ['112px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      // Tamanhos de display do sistema novo. Fora da lista da seção 5 do
      // briefing de propósito: é a escala do site de referência que o
      // Benjamin mandou copiar, e sem ela o site volta a ser tímido.
      144: ['144px', { lineHeight: '0.86', letterSpacing: '-0.03em' }],
      184: ['184px', { lineHeight: '0.84', letterSpacing: '-0.035em' }],
    },
    fontFamily: {
      display: ['var(--font-display)', 'Archivo', 'system-ui', 'sans-serif'],
      body: ['var(--font-body)', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      extrabold: '800',
      black: '900',
    },
    borderRadius: {
      none: '0px',
      DEFAULT: '4px',
      full: '9999px',
    },
    // Sem box-shadow difusa em lugar nenhum.
    boxShadow: {
      none: 'none',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      maxWidth: {
        shell: '1200px',
        measure: '65ch',
      },
      // Alvo de toque mínimo. Fora da escala de 8pt de propósito:
      // 44px é requisito de acessibilidade, não decisão de ritmo.
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // O briefing pede "escurece 6%" no hover do botão. 94 é esse valor
      // exato; a escala padrão do Tailwind só chega a 90 e 95.
      brightness: {
        94: '.94',
      },
    },
  },
  plugins: [],
};

export default config;
