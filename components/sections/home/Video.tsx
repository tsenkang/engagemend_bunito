import { PixelDissolve } from '@/components/ui/PixelDissolve';
import { home } from '@/lib/content';

/**
 * Faixa `ink` de largura inteira com o vídeo dentro.
 *
 * O vídeo é branco por dentro. Solto sobre o creme ele vira um retângulo
 * branco do tamanho da tela e briga com a paleta; a faixa escura
 * enquadra esse branco, reserva a altura (16/9, nada pula ao carregar) e
 * ainda soma cobertura de `ink`.
 */
export function Video() {
  return (
    <section className="relative overflow-hidden bg-ink py-6 md:py-12">
      <PixelDissolve tone="base" />

      <figure className="shell-wide" data-video="">
        <div className="overflow-hidden rounded" data-video-frame="">
          <video
            className="aspect-video w-full rounded"
            controls
            // Nada de vídeo antes do clique. Com `metadata` o Chrome puxava
            // 68 kB do arquivo durante o carregamento, disputando banda numa
            // seção abaixo da dobra que a maioria nunca abre. O pôster não
            // depende disto: segue desenhando o quadro e segurando o 16/9.
            preload="none"
            poster="/video-poster.jpg"
            playsInline
            // Dimensões reais do arquivo (1920x1080). O `aspect-video` já
            // segurava a altura; declarar a razão intrínseca cobre o
            // instante antes de o CSS aplicar.
            width={1920}
            height={1080}
          >
            <source src={home.video.src} type="video/mp4" />
          </video>
        </div>
        <figcaption className="sr-only">{home.video.caption}</figcaption>
      </figure>
    </section>
  );
}
