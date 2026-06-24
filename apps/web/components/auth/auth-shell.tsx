import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { Logo } from "@/components/marketing/logo";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

/** Split-screen auth layout: a calm brand panel beside the Clerk form. */
export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" />
        <div className="pointer-events-none absolute -top-32 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)]" />

        <div className="relative">
          <Link href="/" aria-label="Aptly home">
            <Logo tone="dark" />
          </Link>
        </div>

        <div className="relative max-w-md">
          <Quote className="size-8 text-mist-500" />
          <p className="mt-5 text-2xl leading-snug font-medium tracking-tight">
            Content should adapt to people, not the other way around.
          </p>
          <p className="mt-4 text-sm text-mist-400">
            Reshape dense documents around the way you read — directness,
            detail, focus, comfort and more.
          </p>
        </div>

        <div className="relative text-sm text-mist-500">
          Cognitive content adaptation, grounded in research.
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-mist-500 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-mist-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Shared Clerk appearance so sign-in / sign-up feel native to Aptly. */
export const clerkAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "shadow-none p-0 bg-transparent",
    header: "hidden",
    footer: "hidden",
    socialButtonsBlockButton:
      "border border-mist-200 hover:bg-mist-50 rounded-full h-11",
    formButtonPrimary:
      "bg-ink hover:bg-graphite text-paper rounded-full h-11 text-sm normal-case shadow-none",
    formFieldInput: "rounded-xl border-mist-300 h-11",
    formFieldLabel: "text-ink",
    dividerLine: "bg-mist-200",
    footerAction: "text-mist-600",
  },
} as const;
