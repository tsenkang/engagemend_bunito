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
    <section className="overflow-hidden bg-ink py-6 md:py-12">
      <figure className="shell-wide" data-video="">
        <div className="overflow-hidden rounded" data-video-frame="">
          <video
            className="aspect-video w-full rounded"
            controls
            preload="metadata"
            poster="/video-poster.jpg"
            playsInline
          >
            <source src={home.video.src} type="video/mp4" />
          </video>
        </div>
        <figcaption className="sr-only">{home.video.caption}</figcaption>
      </figure>
    </section>
  );
}
