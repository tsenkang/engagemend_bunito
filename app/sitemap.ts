import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

/**
 * As três rotas do site. `/sobre` e `/servicos` mantêm exatamente os
 * caminhos que já estão indexados — trocar URL jogaria fora o sinal de
 * busca que o site atual acumulou.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: updated, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/sobre`, lastModified: updated, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/servicos`, lastModified: updated, changeFrequency: 'yearly', priority: 0.9 },
  ];
}
