import { Reveal } from "@/components/ui/reveal";
import { Pill } from "@/components/ui/pill";
import { DIMENSIONS } from "@/lib/dimensions";

export function DimensionsSection() {
  return (
    <section
      id="dimensions"
      className="relative scroll-mt-20 border-t border-mist-200 bg-bone py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>Eight cognitive controls</Pill>
          <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Simple controls. A deep engine underneath.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mist-600">
            Instead of dozens of low-level parameters, Aptly abstracts
            complexity into eight intuitive dimensions — reducing configuration
            fatigue while a richer linguistic, structural and semantic system
            does the heavy lifting.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-mist-200 bg-mist-200 sm:grid-cols-2 lg:grid-cols-4">
          {DIMENSIONS.map((dimension, i) => {
            const Icon = dimension.icon;
            return (
              <Reveal key={dimension.key} delay={(i % 4) * 0.05}>
                <article className="group flex h-full flex-col bg-paper p-6 transition-colors hover:bg-mist-50">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-ink text-paper">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    {dimension.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-mist-600">
                    {dimension.question}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-xs text-mist-500">
                    <span>{dimension.lowLabel}</span>
                    <span>{dimension.highLabel}</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-gradient-to-r from-mist-200 via-mist-400 to-ink" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
