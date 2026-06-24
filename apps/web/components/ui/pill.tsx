import { cn } from "@/lib/utils";

interface PillProps {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}

/** Small uppercase eyebrow label used above section headings. */
export function Pill({ children, className, tone = "light" }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase",
        tone === "light"
          ? "border-mist-200 bg-mist-50 text-mist-600"
          : "border-white/15 bg-white/5 text-mist-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
