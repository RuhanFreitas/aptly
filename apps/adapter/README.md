# `adapter` — Aptly adaptation service

This is the service that does the **actual rewriting**. It takes a piece of text
and the eight adaptation dimensions, sends them to an AI model, and returns a
version of the text reshaped to match those dimensions — while keeping the
original meaning and facts intact.

It is a **NestJS microservice** that listens on a **RabbitMQ** queue. It has no
HTTP endpoints; it only reacts to messages from the [`gateway`](../gateway/README.md).

> Part of the [Aptly monorepo](../../README.md).

---

## How it fits in

```
Gateway ──RabbitMQ──▶ adapter ──▶ Groq AI model ──▶ adapted text ──▶ Gateway
            (adapter_queue, event "aptly.event.adapt")
```

The gateway sends `{ content, languageMetrics }`; the adapter replies with the
rewritten content.

---

## What it listens for

### Event: `aptly.event.adapt`

**Payload**

```ts
{
  content: string;            // the raw text extracted from the PDF
  languageMetrics: {          // the eight dimensions, each 0.0 – 1.0
    directness: number;
    detailLevel: number;
    readingComfort: number;
    focusAssistance: number;
    guidance: number;
    simplification: number;
    contextExpansion: number;
    visualIntensity: number;
  }
}
```

**Returns** the adapted content from the AI model.

---

## How the adaptation works

The AI logic lives in `src/ai-service`. The design uses a small abstraction so
the AI provider can be swapped later:

- `AiService` — an abstract class describing the `adapt(metrics, content)` contract.
- `GroqService` — the concrete implementation that calls **Groq**.

The `AiModule` binds `AiService` to `GroqService`, so the rest of the app depends
only on the abstraction.

### Inside `GroqService`

1. **Chunking.** If the text is longer than `CHUNK_SIZE_LIMIT` (16,000
   characters), it is split into smaller chunks at word boundaries. This keeps
   each request within the model's limits.
2. **Prompting.** For each chunk, the service builds a detailed system prompt
   that describes all eight dimensions and injects the user's chosen values. The
   model is instructed to preserve meaning and factual accuracy and to return
   **JSON**.
3. **Model call.** It calls the Groq chat completions API (model
   `openai/gpt-oss-120b`) with a JSON response format.
4. **Consolidation.** If the text was chunked, the individual results are merged
   back into a single `adapted_content` string.

---

## Project structure

```
apps/adapter/
├── src/
│   ├── main.ts                       Bootstraps the RabbitMQ microservice
│   ├── adapter.module.ts             Root module
│   ├── adapter.controller.ts         Listens for "aptly.event.adapt"
│   ├── adapter.service.ts            Delegates to the AI service
│   └── ai-service/
│       ├── ai.module.ts              Binds AiService → GroqService
│       ├── ai.service.ts             Abstract AI provider contract
│       └── groq/
│           └── groq.service.ts       Groq implementation (prompt + chunking)
```

---

## Getting started

From the repository root, install dependencies once:

```bash
npm install
```

Copy the example environment file and fill it in:

```bash
cp apps/adapter/.env.example apps/adapter/.env
```

With **RabbitMQ** running, start the service:

```bash
# from the repo root
npm run dev --workspace=adapter

# or from this folder
npm run dev
```

The service connects to the `adapter_queue` queue and waits for messages.

---

## Scripts

| Script                | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start the microservice.                       |
| `npm run start:dev`   | Start in watch mode (restarts on changes).    |
| `npm run start:prod`  | Run the compiled production build.            |
| `npm run build`       | Compile with the Nest CLI.                    |
| `npm run lint`        | Lint and auto-fix with ESLint.                |
| `npm run test`        | Run unit tests with Jest.                     |

---

## Environment variables

| Variable        | Purpose                                  |
| --------------- | ---------------------------------------- |
| `GROQ_API_KEY`  | API key for the Groq model (used by the Groq SDK). |
| `RBMQ_URL`      | RabbitMQ connection URL.                  |

> The code reads `RBMQ_URL` for the queue connection. If your `.env` uses a
> different name, align the two so the service can connect.
