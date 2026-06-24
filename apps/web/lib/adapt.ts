import type { LanguageMetrics } from "./dimensions";

export interface AdaptRequest {
  url: string;
  metrics: LanguageMetrics;
}

export interface AdaptResult {
  text: string;
  /** The raw payload returned by the backend, kept for debugging/inspection. */
  raw: unknown;
}

/**
 * Normalize the backend's loosely-typed response into readable text.
 *
 * The adapter returns JSON from the AI model whose shape can vary
 * (`adapted_content`, `text`, `content`, or chunked objects), so we probe a
 * few well-known keys before falling back to a readable stringification.
 */
export function extractAdaptedText(payload: unknown): string {
  if (payload == null) return "";
  if (typeof payload === "string") return payload;

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = [
      record.adapted_content,
      record.adaptedContent,
      record.text,
      record.content,
      record.result,
      record.output,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) return candidate;
    }

    // Some chunked responses come back as arrays of fragments.
    if (Array.isArray(record.chunks)) {
      return record.chunks
        .map((chunk) => extractAdaptedText(chunk))
        .filter(Boolean)
        .join("\n\n");
    }
  }

  if (Array.isArray(payload)) {
    return payload
      .map((item) => extractAdaptedText(item))
      .filter(Boolean)
      .join("\n\n");
  }

  return JSON.stringify(payload, null, 2);
}

export async function requestAdaptation(
  body: AdaptRequest,
  signal?: AbortSignal,
): Promise<AdaptResult> {
  const response = await fetch("/api/adapt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  const data = (await response.json().catch(() => null)) as
    | { result?: unknown; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Something went wrong while adapting.");
  }

  return {
    text: extractAdaptedText(data?.result),
    raw: data?.result,
  };
}
