# `web` — Aptly front-end

The user-facing web application for Aptly. It contains two parts:

1. **The marketing site** — the public landing page that explains the product.
2. **The workspace** — an authenticated area where signed-in users paste a PDF
   link, tune the adaptation dimensions, and read the rewritten document.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, and
**Clerk** for authentication.

> Part of the [Aptly monorepo](../../README.md).

---

## What this app is responsible for

- Rendering the public landing page and the in-app workspace.
- Handling sign-in / sign-up through Clerk.
- Providing a small **backend-for-frontend (BFF)** API route that the browser
  talks to. The browser **never** calls the NestJS gateway directly — instead it
  calls `/api/adapt`, which authenticates the session and forwards the request to
  the gateway on the server side. This keeps the gateway URL private and avoids
  cross-origin cookie issues.

---

## Project structure

```
apps/web/
├── app/
│   ├── page.tsx                 Landing page (marketing sections)
│   ├── layout.tsx               Root layout + Clerk provider + fonts
│   ├── globals.css              Tailwind styles and design tokens
│   ├── sign-in/ , sign-up/      Clerk auth pages
│   ├── app/                     The authenticated workspace route
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/adapt/route.ts       BFF proxy to the gateway (auth + validation)
├── components/
│   ├── marketing/               Landing page sections (hero, mission, CTA…)
│   ├── workspace/               The adaptation UI (sliders, output view…)
│   └── ui/                      Small shared UI primitives
├── lib/
│   ├── dimensions.ts            The eight dimensions + presets (source of truth)
│   ├── adapt.ts                 Client helper to call /api/adapt + parse results
│   └── utils.ts                 Small utilities
└── middleware.ts                Clerk middleware protecting /app and /api/adapt
```

---

## Key pieces explained

### The eight dimensions (`lib/dimensions.ts`)

This file defines the eight adaptation dimensions shown as sliders, their labels,
help text, and the **presets** (Balanced, Deep focus, Quick brief, Study mode,
Plain language). The keys match the backend DTO exactly, so the UI and the API
always speak the same language.

### The workspace (`components/workspace/adapter-workspace.tsx`)

The main interactive screen. It lets the user paste a PDF URL, pick a preset or
adjust individual sliders, then sends everything to the backend and renders the
adapted reading. It also supports copying and downloading the result.

### The BFF route (`app/api/adapt/route.ts`)

A server-side route that:

1. Confirms the user is signed in (Clerk `auth()`).
2. Validates the payload (a valid http/https URL and the eight metric numbers,
   clamped to the `0..1` range).
3. Forwards the request to the gateway at `POST /api/adapter`, passing the Clerk
   session cookie along so the gateway can verify it.
4. Returns the adapted result (or a friendly error).

### Auth (`middleware.ts`)

Clerk middleware protects the `/app` workspace and the `/api/adapt` route.
Everything else (the marketing site and auth pages) stays public.

---

## Getting started

From the repository root, install dependencies once:

```bash
npm install
```

Create `apps/web/.env.local` with the following values:

```bash
# Clerk authentication keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Where the NestJS gateway is reachable (defaults to localhost:3001 if unset)
GATEWAY_URL=http://localhost:3001
```

Then run the dev server:

```bash
# from the repo root
npm run dev --workspace=web

# or from this folder
npm run dev
```

The app starts on **http://localhost:3000**.

> The workspace needs the **gateway** running (and the gateway needs RabbitMQ
> plus the `pdf-service` and `adapter` services). See the
> [root README](../../README.md) to start everything together.

---

## Scripts

| Script               | What it does                                |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Start Next.js in development on port 3000.  |
| `npm run build`      | Build the production bundle.                |
| `npm run start`      | Run the production build.                   |
| `npm run lint`       | Lint with ESLint (zero warnings allowed).   |
| `npm run check-types`| Generate Next types and type-check.         |

---

## Environment variables

| Variable                            | Required | Purpose                                              |
| ----------------------------------- | -------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk publishable key, used in the browser.          |
| `CLERK_SECRET_KEY`                  | Yes      | Clerk secret key, used on the server.                |
| `GATEWAY_URL`                       | No       | Gateway base URL. Defaults to `http://localhost:3001`.|
