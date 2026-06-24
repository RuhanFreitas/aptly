"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Target, Sparkles, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PreviewState {
  label: string;
  bars: { icon: LucideIcon; name: string; value: number }[];
  heading: string;
  body: string;
  spacious: boolean;
}

const STATES: PreviewState[] = [
  {
    label: "Quick brief",
    spacious: false,
    bars: [
      { icon: Sparkles, name: "Directness", value: 0.9 },
      { icon: Layers, name: "Detail", value: 0.25 },
      { icon: Wind, name: "Comfort", value: 0.45 },
      { icon: Target, name: "Focus", value: 0.6 },
    ],
    heading: "Working memory, in one line",
    body: "Working memory holds a few items at once. Overload it and comprehension drops. Aptly trims the noise so the core idea lands first.",
  },
  {
    label: "Study mode",
    spacious: true,
    bars: [
      { icon: Sparkles, name: "Directness", value: 0.4 },
      { icon: Layers, name: "Detail", value: 0.85 },
      { icon: Wind, name: "Comfort", value: 0.75 },
      { icon: Target, name: "Focus", value: 0.7 },
    ],
    heading: "Working memory, explained",
    body: "Working memory is the small mental workspace where you hold information while you use it.\n\nIt has limited capacity — usually only a handful of items. When a page demands too much at once, that space overflows and understanding suffers.",
  },
];

export function HeroPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % STATES.length), 4200);
    return () => clearInterval(id);
  }, []);

  const state = STATES[index]!;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.4rem] bg-gradient-to-b from-mist-100 to-transparent" />
      <div className="overflow-hidden rounded-4xl border border-mist-200 bg-paper shadow-[0_24px_70px_-30px_rgba(10,10,11,0.35)]">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-mist-200 px-5 py-3.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-mist-300" />
            <span className="size-2.5 rounded-full bg-mist-200" />
            <span className="size-2.5 rounded-full bg-mist-200" />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={state.label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-paper"
            >
              {state.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="grid gap-0 sm:grid-cols-[0.85fr_1fr]">
          {/* Controls */}
          <div className="space-y-4 border-b border-mist-200 p-5 sm:border-r sm:border-b-0">
            {state.bars.map((bar) => {
              const Icon = bar.icon;
              return (
                <div key={bar.name}>
                  <div className="mb-1.5 flex items-center gap-2 text-xs text-mist-600">
                    <Icon className="size-3.5" />
                    {bar.name}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-mist-200">
                    <motion.div
                      className="h-full rounded-full bg-ink"
                      animate={{ width: `${bar.value * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Output */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.heading}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-sm font-semibold tracking-tight">
                  {state.heading}
                </h3>
                <div
                  className={
                    state.spacious
                      ? "mt-3 space-y-3 text-[13px] leading-relaxed text-mist-600"
                      : "mt-2 text-[13px] leading-snug text-mist-600"
                  }
                >
                  {state.body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
