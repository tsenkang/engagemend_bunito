import type { Metadata } from 'next';

import { Closing } from '@/components/sections/sobre/Closing';
import { Intro } from '@/components/sections/sobre/Intro';
import { Metrics } from '@/components/sections/sobre/Metrics';
import { openGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Quem somos - EngageMend',
  description:
    'Cinco estudantes de Pompeia (SP), interior de São Paulo, por trás da EngageMend.',
  openGraph: openGraph({
    title: 'Quem somos - EngageMend',
    description:
      'Cinco estudantes de Pompeia (SP), interior de São Paulo, por trás da EngageMend.',
  }),
};

export default function SobrePage() {
  return (
    <>
      <Intro />
      <Metrics />
      <Closing />
    </>
  );
}
