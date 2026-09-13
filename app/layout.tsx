import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

import { ContourField } from '@/components/motion/ContourField';
import { Cursor } from '@/components/motion/Cursor';
import { Motion } from '@/components/motion/Motion';
import { Preloader } from '@/components/motion/Preloader';
import { RouteCurtain } from '@/components/motion/RouteCurtain';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { PRELOADER_KEY } from '@/lib/animations';
import { ORGANIZATION_JSON_LD, KEYWORDS, openGraph, SITE_URL } from '@/lib/seo';

import './globals.css';

/**
 * Archivo variável, com o eixo de largura aberto: é ele que deixa a
 * manchete ocupar 110px sem estourar a margem — a condensada cabe onde
 * a normal não caberia. É a peça central do sistema.
 */
/**
 * `optional` em vez de `swap`, e por um motivo medido: a Archivo entra
 * com o eixo de largura fechado em 72, bem mais estreita que qualquer
 * fonte de reserva do sistema. Com `swap`, a manchete era desenhada
 * larga e encolhia quando a fonte chegava — 0,175 de layout shift em
 * `/servicos`, faixa vermelha do Lighthouse.
 *
 * Com `optional` não existe troca: ou a fonte chega a tempo, ou aquele
 * carregamento inteiro usa a reserva. Na segunda visita ela já está em
 * cache e sempre aparece.
 */
const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'optional',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

/** Rótulos e numerais: monoespaçada, caixa alta, bem espaçada. */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const TITLE = 'EngageMend - Empreendedorismo jovem em cidades pequenas';
const DESCRIPTION =
  'A EngageMend fomenta empreendedorismo e inovação em cidades de até 50 mil habitantes. Trabalhamos com jovens de 14 a 19 anos: eles resolvem um desafio real da cidade em poucos dias, com método, orientação e entrega de verdade.';

/**
 * Marca a visita repetida antes da primeira pintura, para que a cortina
 * de abertura não pisque para quem só trocou de rota. Precisa ser
 * síncrono e inline: qualquer atraso já seria um quadro visível.
 */
const VISITED_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(
  PRELOADER_KEY,
)}))document.documentElement.dataset.visited='1'}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  openGraph: openGraph({ title: TITLE, description: DESCRIPTION }),
};

export const viewport: Viewport = {
  themeColor: '#102C26',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: VISITED_SCRIPT }} />

        {/* Sem JavaScript a cortina nunca sairia sozinha. */}
        <noscript>
          <style>{`.preloader,.rail{display:none!important}`}</style>
        </noscript>

        <a
          href="#conteudo"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-50 focus-visible:inline-flex focus-visible:min-h-touch focus-visible:items-center focus-visible:rounded focus-visible:bg-ink focus-visible:px-3 focus-visible:text-16 focus-visible:font-medium focus-visible:text-base"
        >
          Pular para o conteúdo
        </a>

        <ContourField />

        {/* Tudo passa por cima da tela do campo de curvas. */}
        <div className="layer">
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </div>

        <Cursor />
        <ScrollProgress />
        <Preloader />
        <RouteCurtain />
        <SmoothScroll />
        <Motion />

        <script
          type="application/ld+json"
          // Conteúdo fixo, definido no build. Sem entrada de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </body>
    </html>
  );
}
