import { Reveal } from "@/components/ui/reveal";
import { Pill } from "@/components/ui/pill";
import { Link2, SlidersHorizontal, BookOpenCheck } from "lucide-react";

const STEPS = [
  {
    icon: Link2,
    title: "Bring a document",
    body: "Point Aptly at a PDF. We extract the text and prepare it for adaptation — your source stays untouched.",
  },
  {
    icon: SlidersHorizontal,
    title: "Tune your reading",
    body: "Move eight simple sliders — or pick a preset — to describe how you want to read. Directness, detail, focus, comfort and more.",
  },
  {
    icon: BookOpenCheck,
    title: "Read it your way",
    body: "Aptly rewrites the content to fit, preserving meaning and facts while removing the friction between you and the page.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="max-w-2xl">
          <Pill>How it works</Pill>
          <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            From dense document to a reading experience that fits.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="relative h-full rounded-4xl border border-mist-200 bg-paper p-8">
                  <span className="font-mono text-sm text-mist-400">
                    Step 0{i + 1}
                  </span>
                  <div className="mt-4 flex size-12 items-center justify-center rounded-2xl bg-bone text-ink">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-mist-600">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
