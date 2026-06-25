"use client";

import { useMemo, useRef, useState } from "react";
import {
  Link2,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Download,
  Loader2,
  FileText,
  TriangleAlert,
} from "lucide-react";
import {
  DIMENSIONS,
  PRESETS,
  DEFAULT_METRICS,
  type LanguageMetrics,
  type DimensionKey,
} from "@/lib/dimensions";
import { requestAdaptation } from "@/lib/adapt";
import { downloadNodeAsPdf } from "@/lib/export-pdf";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DimensionControl } from "./dimension-control";
import { OutputView } from "./output-view";

export function AdapterWorkspace() {
  const [url, setUrl] = useState("");
  const [metrics, setMetrics] = useState<LanguageMetrics>(DEFAULT_METRICS);
  const [activePreset, setActivePreset] = useState<string | null>("balanced");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const wordCount = useMemo(
    () => (output ? output.trim().split(/\s+/).filter(Boolean).length : 0),
    [output],
  );

  const setMetric = (key: DimensionKey, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setMetrics(preset.metrics);
    setActivePreset(presetId);
  };

  const reset = () => applyPreset("balanced");

  const canAdapt = url.trim().length > 0 && !loading;

  const handleAdapt = async () => {
    if (!canAdapt) return;
    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await requestAdaptation(
        { url: url.trim(), metrics },
        controller.signal,
      );
      if (!result.text.trim()) {
        setError("The document came back empty. Try a different PDF link.");
        setOutput(null);
      } else {
        setOutput(result.text);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = async () => {
    if (!output || !outputRef.current || downloading) return;
    setDownloading(true);
    try {
      await downloadNodeAsPdf(outputRef.current, "aptly-adapted.pdf");
    } catch {
      setError("We couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[400px_1fr] lg:py-8">
      {/* Controls */}
      <div className="space-y-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
        {/* Source */}
        <section className="rounded-2xl border border-mist-200 bg-paper p-5">
          <label
            htmlFor="pdf-url"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <Link2 className="size-4" />
            Document link
          </label>
          <p className="mt-1 text-xs text-mist-500">
            Paste a link to a PDF. Aptly extracts the text and adapts it.
          </p>
          <input
            id="pdf-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com/document.pdf"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            // Browser extensions / form fillers mutate inputs before hydration.
            suppressHydrationWarning
            className="mt-3 h-11 w-full rounded-xl border border-mist-300 bg-paper px-3.5 text-sm outline-none transition-colors focus:border-ink"
          />
        </section>

        {/* Presets */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-medium tracking-widest text-mist-500 uppercase">
              Presets
            </h2>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-mist-500 transition-colors hover:text-ink"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                title={preset.description}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activePreset === preset.id
                    ? "border-ink bg-ink text-paper"
                    : "border-mist-200 bg-paper text-mist-600 hover:border-mist-300 hover:text-ink",
                )}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        {/* Dimensions */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium tracking-widest text-mist-500 uppercase">
            Adaptation dimensions
          </h2>
          {DIMENSIONS.map((dimension) => (
            <DimensionControl
              key={dimension.key}
              dimension={dimension}
              value={metrics[dimension.key]}
              onChange={(value) => setMetric(dimension.key, value)}
              disabled={loading}
            />
          ))}
        </section>

        <Button
          size="lg"
          className="w-full"
          onClick={handleAdapt}
          disabled={!canAdapt}
          // Some extensions strip/toggle `disabled` on buttons before hydration.
          suppressHydrationWarning
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Adapting…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Adapt document
            </>
          )}
        </Button>
      </div>

      {/* Output */}
      <div className="rounded-3xl border border-mist-200 bg-paper">
        <div className="flex items-center justify-between border-b border-mist-200 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-mist-500" />
            <h2 className="text-sm font-semibold tracking-tight">
              Adapted reading
            </h2>
            {output && (
              <span className="text-xs text-mist-400">· {wordCount} words</span>
            )}
          </div>
          {output && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-mist-600 transition-colors hover:bg-mist-100 hover:text-ink"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-mist-600 transition-colors hover:bg-mist-100 hover:text-ink disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
                {downloading ? "Preparing…" : "Download PDF"}
              </button>
            </div>
          )}
        </div>

        <div className="min-h-[60vh] p-6 sm:p-8 lg:p-10">
          {loading && <OutputSkeleton />}

          {!loading && error && (
            <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-mist-100 text-ink">
                <TriangleAlert className="size-5" />
              </span>
              <p className="mt-4 font-medium">We couldn’t adapt that</p>
              <p className="mt-1 text-sm text-mist-500">{error}</p>
            </div>
          )}

          {!loading && !error && output && (
            <div ref={outputRef} className="bg-paper">
              <OutputView
                text={output}
                readingComfort={metrics.readingComfort}
                visualIntensity={metrics.visualIntensity}
              />
            </div>
          )}

          {!loading && !error && !output && <EmptyState />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-bone text-ink">
        <Sparkles className="size-6" />
      </span>
      <p className="mt-5 text-lg font-semibold tracking-tight">
        Your adapted reading appears here
      </p>
      <p className="mt-2 text-sm leading-relaxed text-mist-500">
        Paste a PDF link, tune the eight dimensions to match how you want to
        read, then press{" "}
        <span className="font-medium text-ink">Adapt document</span>.
      </p>
    </div>
  );
}

function OutputSkeleton() {
  const widths = ["92%", "80%", "96%", "70%", "88%", "60%", "94%", "76%"];
  return (
    <div className="mx-auto max-w-[64ch] animate-pulse space-y-6">
      <div className="h-6 w-1/2 rounded bg-mist-200" />
      <div className="space-y-3">
        {widths.map((w, i) => (
          <div
            key={i}
            className="h-3.5 rounded bg-mist-100"
            style={{ width: w }}
          />
        ))}
      </div>
      <div className="h-5 w-1/3 rounded bg-mist-200" />
      <div className="space-y-3">
        {widths.slice(0, 5).map((w, i) => (
          <div
            key={i}
            className="h-3.5 rounded bg-mist-100"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}
