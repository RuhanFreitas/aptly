import { Reveal } from "@/components/ui/reveal";
import { Pill } from "@/components/ui/pill";

const POINTS = [
  {
    title: "Friction, not capability",
    body: "For many people the challenge isn’t intelligence — it’s the friction between them and the way information is presented.",
  },
  {
    title: "One size fits no one",
    body: "Traditional systems assume everyone reads the same way. Decades of research say otherwise.",
  },
  {
    title: "Structure changes everything",
    body: "How information is structured, paced and presented shapes comprehension, focus, retention and fatigue.",
  },
];

export function Mission() {
  return (
    <section id="mission" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Pill>Our mission</Pill>
            <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Information isn’t equally accessible to everyone.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-mist-600">
              Cognitive overload, attention fragmentation, dense layouts and
              inaccessible structures make reading genuinely hard for many
              people. Aptly exists because we believe content should adapt to
              people — not the other way around.
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-4xl border border-mist-200 bg-mist-200 sm:grid-cols-1">
            {POINTS.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.08}>
                <div className="h-full bg-paper p-7 sm:p-8">
                  <span className="font-mono text-sm text-mist-400">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">
                    {point.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-mist-600">
                    {point.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
