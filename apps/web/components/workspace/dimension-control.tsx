"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { DimensionMeta } from "@/lib/dimensions";
import { cn } from "@/lib/utils";

interface DimensionControlProps {
  dimension: DimensionMeta;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DimensionControl({
  dimension,
  value,
  onChange,
  disabled,
}: DimensionControlProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = dimension.icon;
  const percent = Math.round(value * 100);

  return (
    <div className="rounded-2xl border border-mist-200 bg-paper p-4 transition-colors hover:border-mist-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-bone text-ink">
            <Icon className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              {dimension.label}
            </p>
            <p className="text-xs text-mist-500">{dimension.question}</p>
          </div>
        </div>
        <span className="font-mono text-xs tabular-nums text-mist-500">
          {percent}%
        </span>
      </div>

      <div className="mt-3.5">
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={dimension.label}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-mist-200 accent-ink disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, var(--color-ink) ${percent}%, var(--color-mist-200) ${percent}%)`,
          }}
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-mist-400">
          <span>{dimension.lowLabel}</span>
          <span>{dimension.highLabel}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-mist-500 transition-colors hover:text-ink"
        aria-expanded={expanded}
      >
        <ChevronRight
          className={cn(
            "size-3 transition-transform",
            expanded && "rotate-90",
          )}
        />
        What this controls
      </button>

      {expanded && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {dimension.controls.map((control) => (
            <span
              key={control}
              className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] text-mist-600"
            >
              {control}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
