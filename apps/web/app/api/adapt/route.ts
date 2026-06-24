import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { DimensionKey, LanguageMetrics } from "@/lib/dimensions";

export const runtime = "nodejs";

const DIMENSION_KEYS: DimensionKey[] = [
  "directness",
  "detailLevel",
  "readingComfort",
  "focusAssistance",
  "guidance",
  "simplification",
  "contextExpansion",
  "visualIntensity",
];

function parseMetrics(input: unknown): LanguageMetrics | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;
  const metrics = {} as LanguageMetrics;

  for (const key of DIMENSION_KEYS) {
    const value = record[key];
    if (typeof value !== "number" || Number.isNaN(value)) return null;
    // Clamp defensively so the backend always receives a valid 0..1 range.
    metrics[key] = Math.min(1, Math.max(0, value));
  }

  return metrics;
}

function isLikelyPdfUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Backend-for-frontend proxy.
 *
 * The browser never talks to the NestJS gateway directly: we authenticate the
 * Clerk session here, validate the payload, then forward the request from the
 * server. This keeps the gateway URL private and avoids cross-origin/cookie
 * complexity.
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Default to the local gateway so development works without extra setup;
  // override via GATEWAY_URL in other environments.
  const gatewayUrl = process.env.GATEWAY_URL ?? "http://localhost:3001";

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const body = payload as { url?: unknown; metrics?: unknown };
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const metrics = parseMetrics(body.metrics);

  if (!url || !isLikelyPdfUrl(url)) {
    return NextResponse.json(
      { error: "Provide a valid PDF link (http or https)." },
      { status: 400 },
    );
  }
  if (!metrics) {
    return NextResponse.json(
      { error: "Adaptation settings are incomplete." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(`${gatewayUrl}/api/adapter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the Clerk session cookie so the gateway guard can verify it.
        cookie: request.headers.get("cookie") ?? "",
      },
      body: JSON.stringify({ languageMetrics: metrics, url }),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "The document could not be adapted. Please try again." },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    return NextResponse.json({ result: data });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the adaptation service." },
      { status: 504 },
    );
  }
}
