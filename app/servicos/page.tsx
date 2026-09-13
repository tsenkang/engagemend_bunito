import type { Metadata } from 'next';

import { Closing } from '@/components/sections/servicos/Closing';
import { Formats } from '@/components/sections/servicos/Formats';
import { Intro } from '@/components/sections/servicos/Intro';
import { Practice } from '@/components/sections/servicos/Practice';
import { Steps } from '@/components/sections/servicos/Steps';
import { openGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Como funciona - EngageMend',
  description:
    'Como a EngageMend monta uma maratona de criação na sua cidade: as quatro etapas e os formatos midiathon e hackathon.',
  openGraph: openGraph({
    title: 'Como funciona - EngageMend',
    description:
      'Montamos uma maratona de criação na sua cidade. Jovens de 14 a 19 anos resolvendo um desafio real em poucos dias.',
  }),
};

export default function ServicosPage() {
  return (
    <>
      <Intro />
      <Steps />
      <Practice />
      <Formats />
      <Closing />
    </>
  );
}
