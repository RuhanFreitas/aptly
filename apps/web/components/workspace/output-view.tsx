"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface OutputViewProps {
  text: string;
  /** Drives line height, measure and spacing (0..1). */
  readingComfort: number;
  /** Drives heading/emphasis contrast and weight (0..1). */
  visualIntensity: number;
}

/**
 * Renders the adapted content. Two of the cognitive dimensions are honoured
 * visually here so the controls have an immediate, felt effect on the page:
 * reading comfort shapes pacing and line length, visual intensity shapes
 * hierarchy and emphasis.
 */
export function OutputView({
  text,
  readingComfort,
  visualIntensity,
}: OutputViewProps) {
  const lineHeight = 1.55 + readingComfort * 0.45; // 1.55 → 2.0
  const measure = 70 - readingComfort * 16; // 70ch → 54ch (calmer = narrower)
  const fontSize = 16 + readingComfort * 2; // 16px → 18px
  const headingWeight = 600 + Math.round(visualIntensity * 1) * 100; // 600 → 700
  const emphasisStrong = visualIntensity > 0.55;

  return (
    <div
      className="mx-auto"
      style={{ maxWidth: `${measure}ch`, fontSize, lineHeight }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // The adapted content can contain raw HTML tags from the AI model.
        // `rehype-raw` parses that HTML so it renders as real elements instead
        // of leaking through as escaped text, and `rehype-sanitize` strips
        // anything unsafe (scripts, event handlers, etc.) since this content is
        // model-generated and must not be trusted.
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h1
              className="mt-8 mb-3 text-2xl tracking-tight first:mt-0"
              style={{ fontWeight: headingWeight }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="mt-7 mb-2.5 text-xl tracking-tight first:mt-0"
              style={{ fontWeight: headingWeight }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="mt-6 mb-2 text-lg tracking-tight first:mt-0"
              style={{ fontWeight: headingWeight }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="text-ink/85"
              style={{ marginTop: "0.9em", marginBottom: "0.9em" }}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-1.5 pl-5 text-ink/85">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-1.5 pl-5 text-ink/85">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong
              className={cn(
                "font-semibold",
                emphasisStrong
                  ? "rounded bg-mist-900/5 px-1 text-ink"
                  : "text-ink",
              )}
            >
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-ink/30 pl-4 text-mist-600 italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-mist-100 px-1.5 py-0.5 font-mono text-[0.85em]">
              {children}
            </code>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-ink underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-8 border-mist-200" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
