import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "light" | "dark";
  withWordmark?: boolean;
}

/** Aptly mark: a stack of lines that condenses — content adapting to a reader. */
export function Logo({ className, tone = "light", withWordmark = true }: LogoProps) {
  const fg = tone === "light" ? "text-ink" : "text-paper";
  return (
    <span className={cn("inline-flex items-center gap-2.5", fg, className)}>
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          tone === "light" ? "bg-ink text-paper" : "bg-paper text-ink",
        )}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="3" width="14" height="1.8" rx="0.9" fill="currentColor" />
          <rect x="2" y="8.1" width="10" height="1.8" rx="0.9" fill="currentColor" />
          <rect
            x="2"
            y="13.2"
            width="6"
            height="1.8"
            rx="0.9"
            fill="currentColor"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight">Aptly</span>
      )}
    </span>
  );
}
