import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Pill } from "@/components/ui/pill";
import { buttonClasses } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      id="research"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-24 text-paper sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
        <Reveal>
          <Pill tone="dark">
            <ShieldCheck className="size-3.5" />
            Transparent by design
          </Pill>
          <h2 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Reading should adapt to you.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist-300">
            Every scientific reference and research foundation behind Aptly is
            documented openly and properly credited. Start reshaping content
            around the way you think.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className={buttonClasses({
                size: "lg",
                className: "bg-paper text-ink hover:bg-bone",
              })}
            >
              Create your account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/app"
              className={buttonClasses({
                variant: "outline",
                size: "lg",
                className:
                  "border-white/20 text-paper hover:border-white/60 hover:bg-white/5",
              })}
            >
              Open the workspace
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
