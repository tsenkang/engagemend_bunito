import { sobre } from '@/lib/content';

export function Closing() {
  return (
    <section
      className="texture texture-light on-ink border-b border-base/15 bg-ink py-12 text-base md:py-20"
      data-dark=""
    >
      <div className="shell-wide">
        <blockquote>
          <p className="display d-section max-w-[24ch]">{sobre.quote}</p>
        </blockquote>
      </div>
    </section>
  );
}
