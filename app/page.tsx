import { Contact } from '@/components/sections/home/Contact';
import { Hero } from '@/components/sections/home/Hero';
import { Method } from '@/components/sections/home/Method';
import { Problem } from '@/components/sections/home/Problem';
import { Quote } from '@/components/sections/home/Quote';
import { Statement } from '@/components/sections/home/Statement';
import { Marquee } from '@/components/ui/Marquee';
import { marquee } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={marquee} />
      <Problem />
      <Method />
      <Statement />
      <Quote />
      <Contact />
    </>
  );
}
