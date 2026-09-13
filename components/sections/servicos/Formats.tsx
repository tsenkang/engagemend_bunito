import { labels, servicos } from '@/lib/content';

/**
 * Os dois formatos sobre o bloco escuro, em cartões que clareiam o
 * próprio `ink` — sem cor nova, só opacidade de `base` por cima.
 */
export function Formats() {
  return (
    <section
      className="texture texture-light on-ink bg-ink py-12 text-base md:py-20"
      data-dark=""
    >
      <div className="shell-wide">
        <p className="label text-base/60">{labels.servicosFormats}</p>

        <h2 className="display d-giant mt-5 md:mt-8">{servicos.formatsHeadline}</h2>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {servicos.formats.map((format) => (
            <div key={format.name} data-enter="" className="panel rounded p-6 md:p-8">
              <div className="h-1 w-10 bg-accent" aria-hidden="true" />
              <h3 className="display display-caps mt-6 text-32 md:text-48">{format.name}</h3>
              <p className="mt-4 max-w-measure text-18 text-base/70 md:text-20">
                {format.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-measure text-18 md:mt-12 md:text-20">
          {servicos.formatsNote}
        </p>
      </div>
    </section>
  );
}
