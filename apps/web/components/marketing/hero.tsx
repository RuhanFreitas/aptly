import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import { buttonClasses } from "@/components/ui/button";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Backdrop: soft grid fading into a radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-edges opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,10,11,0.06),transparent)]" />

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <Pill>
              <Sparkles className="size-3.5" />
              Cognitive content adaptation
            </Pill>

            <h1 className="mt-6 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Content that adapts to how you think.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-600">
              Aptly reshapes dense documents around the way{" "}
              <span className="text-ink">you</span> read — directness, detail,
              focus, comfort and more. Less friction between you and the page,
              more understanding.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                Start adapting — free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#dimensions"
                className={buttonClasses({ variant: "outline", size: "lg" })}
              >
                Explore the controls
              </Link>
            </div>

            <p className="mt-6 text-sm text-mist-500">
              Built on research across cognitive science, accessibility &amp;
              human-computer interaction.
            </p>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <HeroPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
