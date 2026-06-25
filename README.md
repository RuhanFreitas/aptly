# Aptly

> Content that adapts to how you think.

Aptly is a **cognitive content adaptation platform**. You give it a link to a PDF
and tell it _how_ you like to read — more direct, more detailed, calmer, simpler,
more guided, and so on. Aptly reads the document and rewrites it to match your
preferences, without changing what it actually says.

The core idea is simple: **content should adapt to people, not the other way
around.** Two readers can take the same dense document and each get a version
shaped around their own attention, energy, and comprehension needs.

---

## Table of contents

- [How it works](#how-it-works)
- [The eight adaptation dimensions](#the-eight-adaptation-dimensions)
- [Architecture](#architecture)
- [Project layout](#project-layout)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Running the project](#running-the-project)
- [Environment variables](#environment-variables)
- [Useful commands](#useful-commands)
- [Per-package documentation](#per-package-documentation)

---

## How it works

From a user's point of view, the flow is short:

1. Sign in and open the workspace.
2. Paste a link to a PDF.
3. Adjust eight sliders that describe how you want to read (or pick a preset).
4. Press **Adapt document** and read the rewritten version.

Behind the scenes, several services cooperate to make that happen:

```
Browser ──▶ Web app (Next.js)
                │  POST /api/adapt  (authenticates the user, hides the backend)
                ▼
            Gateway (NestJS, HTTP)
                │
                ├─▶ PDF service        download + extract text from the PDF
                │       (RabbitMQ)
                │
                └─▶ Adapter service    rewrite the text with an AI model
                        (RabbitMQ)
                ▼
            Adapted text ──▶ back to the browser
```

The web app never talks to the backend directly. It calls its own API route,
which checks that you are signed in and then forwards the request to the
gateway. The gateway orchestrates the two background microservices over a
message queue and returns the final, adapted text.

---

## The eight adaptation dimensions

Every adaptation is described by eight values, each a number between **0.0**
(minimum) and **1.0** (maximum). They are intentionally simple controls that sit
on top of a much deeper rewriting process.

| Dimension            | Question it answers                                | Low (0.0)                      | High (1.0)                                  |
| -------------------- | -------------------------------------------------- | ------------------------------ | ------------------------------------------- |
| **Directness**       | How direct should the content be?                  | More context, gradual buildup  | Objective, concise, essentials only         |
| **Detail level**     | How much detail do you want?                        | High-level overview            | Comprehensive, nuanced, technical depth     |
| **Reading comfort**  | How easy and calm should reading feel?              | Dense, few breaks              | Short paragraphs, spacing, calmer rhythm    |
| **Focus assistance** | How much should the text guide your attention?      | Natural, minimal emphasis      | Highlights key ideas, reduces distractions  |
| **Guidance**         | How structured should the reading experience be?    | Original flow                  | Clear sections, headings, summaries         |
| **Simplification**   | How simple should the language become?              | Original vocabulary            | Simpler words and shorter sentences         |
| **Context expansion**| How much supporting context should be added?        | Lean, minimal                  | Extra examples, inline definitions          |
| **Visual intensity** | How much visual emphasis should be used?            | Minimal formatting             | Strong hierarchy and emphasis               |

These values map one-to-one across the whole system: the sliders in the web app,
the validated `LanguageMetricsDTO`, and the prompt sent to the AI model all use
the same eight keys.

---

## Architecture

Aptly is a **Turborepo monorepo** that contains two kinds of code:

- **Apps** — runnable services (the website and three backend services).
- **Packages** — shared code reused by the apps (types, DTOs, configs, UI).

### The services

| Service                                | Type                       | Responsibility                                                        |
| -------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| [`web`](./apps/web)                    | Next.js web app            | Marketing site + the authenticated adaptation workspace (the UI).     |
| [`gateway`](./apps/gateway)            | NestJS HTTP API            | Public entry point. Authenticates requests and orchestrates the rest. |
| [`pdf-service`](./apps/pdf-service)    | NestJS microservice (RMQ)  | Downloads a PDF from a URL and extracts its text.                     |
| [`adapter`](./apps/adapter)            | NestJS microservice (RMQ)  | Rewrites text with an AI model based on the eight dimensions.         |

The gateway communicates with `pdf-service` and `adapter` through **RabbitMQ**
message queues, so the heavy work (parsing and AI rewriting) happens
asynchronously and independently from the HTTP request.

### Request lifecycle

1. The browser sends `{ url, metrics }` to the web app's `/api/adapt` route.
2. That route verifies the **Clerk** session and forwards the request to the
   gateway at `POST /api/adapter`.
3. The gateway asks `pdf-service` to fetch and parse the PDF
   (event `aptly.event.parse_pdf`).
4. The gateway sends the extracted text and the metrics to `adapter`
   (event `aptly.event.adapt`).
5. `adapter` calls the AI model, rewrites the content, and returns it.
6. The adapted text travels back up the chain to the browser.

---

## Project layout

```
aptly/
├── apps/
│   ├── web/          Next.js front-end (marketing + workspace)
│   ├── gateway/      NestJS HTTP API and orchestrator
│   ├── pdf-service/  NestJS microservice: PDF → text
│   └── adapter/      NestJS microservice: text → adapted text (AI)
├── packages/
│   ├── types/             Shared TypeScript types (LanguageMetrics, etc.)
│   ├── dtos/              Shared, validated DTOs (class-validator)
│   ├── ui/                Shared React components
│   ├── eslint-config/     Shared ESLint configuration
│   └── typescript-config/ Shared tsconfig presets
├── turbo.json        Turborepo task pipeline
└── package.json      Workspace root (npm workspaces + scripts)
```

---

## Tech stack

- **Monorepo:** [Turborepo](https://turborepo.dev) + npm workspaces
- **Language:** TypeScript everywhere
- **Front-end:** [Next.js 16](https://nextjs.org), React 19, Tailwind CSS 4, Framer Motion
- **Back-end:** [NestJS 11](https://nestjs.com)
- **Messaging:** [RabbitMQ](https://www.rabbitmq.com) (via `@nestjs/microservices`)
- **Authentication:** [Clerk](https://clerk.com)
- **AI:** [Groq](https://groq.com) (`groq-sdk`)
- **PDF parsing:** [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
- **Validation:** `class-validator` / `class-transformer`

---

## Getting started

### Prerequisites

- **Node.js 18+** (the repo pins npm via `packageManager`, currently `npm@11`)
- A running **RabbitMQ** instance (local Docker is the easiest option)
- A **Clerk** account (publishable + secret keys)
- A **Groq** API key

You can start RabbitMQ quickly with Docker:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### Install

From the repository root, install everything in one go:

```bash
npm install
```

This installs dependencies for every app and package in the workspace.

### Configure

Each backend service ships an `.env.example`. Copy them and fill in your values
(see [Environment variables](#environment-variables) below):

```bash
cp apps/gateway/.env.example     apps/gateway/.env
cp apps/adapter/.env.example     apps/adapter/.env
cp apps/pdf-service/.env.example apps/pdf-service/.env
```

The web app also needs its own `.env.local` with the Clerk keys and the gateway
URL (see its [README](./apps/web)).

---

## Running the project

To run **everything** at once in development mode:

```bash
npm run dev
```

Turborepo starts each app's `dev` task in parallel:

- Web app on **http://localhost:3000**
- Gateway on **http://localhost:3001**
- `pdf-service` and `adapter` connect to RabbitMQ and wait for messages

To run a single app, use a workspace filter, for example:

```bash
npm run dev --workspace=web
npm run dev --workspace=gateway
```

> The backend services depend on RabbitMQ being reachable, and the gateway and
> adapter need their API keys. If a service exits immediately on startup, check
> its environment variables first.

---

## Environment variables

> Names are taken from the code and the `.env.example` files. Some service
> configuration is still being unified, so double-check the variable name your
> service reads if a connection fails.

### `apps/gateway`

| Variable             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `PORT`               | HTTP port the gateway listens on (e.g. `3001`).    |
| `CLERK_SECRET_KEY`   | Clerk secret key used to verify session tokens.    |
| `RBMQ_URL`           | RabbitMQ connection URL used to reach the services.|

### `apps/adapter`

| Variable        | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `GROQ_API_KEY`  | API key for the Groq AI model.                     |
| `RBMQ_URL`      | RabbitMQ connection URL.                            |

### `apps/pdf-service`

| Variable     | Purpose                       |
| ------------ | ----------------------------- |
| `RBMQ_URL`   | RabbitMQ connection URL.       |

### `apps/web`

| Variable                              | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Clerk publishable key (browser).                     |
| `CLERK_SECRET_KEY`                    | Clerk secret key (server).                           |
| `GATEWAY_URL`                         | Base URL of the gateway (defaults to localhost:3001).|

---

## Useful commands

Run these from the repository root:

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Start every app in development mode.                    |
| `npm run build`        | Build every app and package.                            |
| `npm run lint`         | Lint the whole monorepo.                                |
| `npm run check-types`  | Type-check the whole monorepo.                          |
| `npm run format`       | Format the codebase with Prettier.                      |

Add `--workspace=<name>` (e.g. `--workspace=gateway`) to target a single app.

---

## Per-package documentation

Each app and shared package has its own README with deeper detail:

- [`apps/web`](./apps/web/README.md) — the Next.js front-end
- [`apps/gateway`](./apps/gateway/README.md) — the HTTP gateway / orchestrator
- [`apps/pdf-service`](./apps/pdf-service/README.md) — PDF text extraction
- [`apps/adapter`](./apps/adapter/README.md) — AI-powered adaptation
- [`packages/types`](./packages/types/README.md) — shared TypeScript types
- [`packages/dtos`](./packages/dtos/README.md) — shared validated DTOs
- [`packages/ui`](./packages/ui/README.md) — shared React components
- [`packages/eslint-config`](./packages/eslint-config/README.md) — shared ESLint config
- [`packages/typescript-config`](./packages/typescript-config/README.md) — shared tsconfig presets
