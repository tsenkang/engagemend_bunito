import { PixelDissolve } from '@/components/ui/PixelDissolve';
import { Ramp } from '@/components/ui/Ramp';
import { home } from '@/lib/content';

/**
 * O fecho do método ganha uma tela só para ele. A primeira frase prepara
 * em corpo de leitura; a segunda leva o tamanho gigante do sistema. É a
 * mesma linha do briefing, só que quebrada onde ela já tinha ponto.
 */
export function Statement() {
  return (
    <section className="texture border-y border-ink/16 py-12 md:py-20">
      <PixelDissolve tone="ink" />

      <div className="shell-wide" data-enter="" data-skew="">
        <Ramp count={8} />

        <p className="mt-6 max-w-measure text-20 text-ink/70 md:mt-8 md:text-24">
          {home.method.closingLead}
        </p>

        <p className="display d-giant mt-2 md:mt-4">{home.method.closingPunch}</p>
      </div>
    </section>
  );
}
