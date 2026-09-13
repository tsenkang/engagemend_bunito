import { site } from '@/lib/content';

/**
 * Domínio de produção. Defina `NEXT_PUBLIC_SITE_URL` no Netlify com a
 * URL real do site; sem isso as URLs absolutas de OG e do sitemap
 * apontam para o host local.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const KEYWORDS = [
  'empreendedorismo jovem',
  'inovação em cidades pequenas',
  'maratona de criação',
  'midiathon',
  'hackathon',
  'EngageMend',
];

/**
 * O `openGraph` de uma rota substitui o do layout por inteiro, então os
 * campos comuns (site_name, type, locale) precisam ser remontados a
 * cada rota. Este helper é o único lugar onde eles são escritos.
 */
export function openGraph(fields: { title: string; description: string }) {
  return {
    siteName: site.name,
    type: 'website' as const,
    locale: 'pt_BR',
    ...fields,
  };
}

export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  description:
    'A EngageMend fomenta empreendedorismo e inovação em cidades de até 50 mil habitantes. Trabalhamos com jovens de 14 a 19 anos: eles resolvem um desafio real da cidade em poucos dias, com método, orientação e entrega de verdade.',
  email: site.email,
  url: SITE_URL,
  sameAs: [site.instagram, site.linkedin],
} as const;
