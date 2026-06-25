# `gateway` — Aptly HTTP gateway

The gateway is the **public entry point** to Aptly's backend. It is the only
backend service that speaks HTTP; the others are background workers it talks to
over a message queue.

Its job is to **authenticate** incoming requests and **orchestrate** the two
microservices that do the real work:

1. Ask the [`pdf-service`](../pdf-service/README.md) to download a PDF and
   extract its text.
2. Ask the [`adapter`](../adapter/README.md) to rewrite that text according to
   the user's chosen dimensions.

Built with **NestJS 11**. It uses **RabbitMQ** to reach the microservices and
**Clerk** to verify user sessions.

> Part of the [Aptly monorepo](../../README.md).

---

## How it fits in

```
Web app  ──HTTP──▶  Gateway  ──RabbitMQ──▶  pdf-service   (parse PDF → text)
                       │
                       └──────RabbitMQ──▶  adapter       (text → adapted text)
```

The gateway exposes a single main endpoint. The web app's BFF route calls it,
and the gateway coordinates everything else.

---

## The main endpoint

### `POST /api/adapter`

All routes are served under the global `/api` prefix.

**Request body**

```json
{
  "url": "https://example.com/document.pdf",
  "languageMetrics": {
    "directness": 0.5,
    "detailLevel": 0.5,
    "readingComfort": 0.5,
    "focusAssistance": 0.5,
    "guidance": 0.5,
    "simplification": 0.5,
    "contextExpansion": 0.5,
    "visualIntensity": 0.5
  }
}
```

**What happens**

1. The gateway sends the URL to `pdf-service` (event `aptly.event.parse_pdf`)
   and waits for the extracted text.
2. If the PDF has no extractable text, it returns an error.
3. It sends the text and `languageMetrics` to `adapter`
   (event `aptly.event.adapt`) and waits for the rewritten content.
4. It returns the adapted content to the caller.

---

## Project structure

```
apps/gateway/
├── src/
│   ├── main.ts                     Bootstraps the HTTP server (prefix /api)
│   ├── app.module.ts               Root module wiring everything together
│   ├── adapter/
│   │   ├── adapter.controller.ts   POST /api/adapter — orchestrates the flow
│   │   ├── adapter.service.ts      Sends "adapt" messages over RabbitMQ
│   │   └── adapter.module.ts       Registers the RabbitMQ client (adapter_queue)
│   ├── pdf/
│   │   ├── pdf.service.ts          Sends "parse_pdf" messages over RabbitMQ
│   │   └── pdf.module.ts           Registers the RabbitMQ client (pdf_queue)
│   └── guards/
│       └── clerk-auth.guard.ts     Verifies the Clerk session cookie
```

### A note on the message queues

The gateway acts as a **client** to two RabbitMQ queues:

- `pdf_queue` → handled by `pdf-service`
- `adapter_queue` → handled by `adapter`

It uses the request/response style of NestJS microservices (`client.send(...)`),
so each call waits for the worker to reply.

### Authentication

`clerk-auth.guard.ts` reads the `__session` cookie and verifies it with Clerk.
The web app forwards this cookie when it proxies requests, so the gateway can
confirm the user is logged in.

---

## Getting started

From the repository root, install dependencies once:

```bash
npm install
```

Copy the example environment file and fill it in:

```bash
cp apps/gateway/.env.example apps/gateway/.env
```

Make sure **RabbitMQ** is running and the `pdf-service` and `adapter` workers are
started, then run the gateway:

```bash
# from the repo root
npm run dev --workspace=gateway

# or from this folder
npm run dev
```

By default it listens on the port set in `PORT` (e.g. `3001`).

---

## Scripts

| Script                | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start the server.                             |
| `npm run start:dev`   | Start in watch mode (restarts on changes).    |
| `npm run start:prod`  | Run the compiled production build.            |
| `npm run build`       | Compile with the Nest CLI.                    |
| `npm run lint`        | Lint and auto-fix with ESLint.                |
| `npm run test`        | Run unit tests with Jest.                     |
| `npm run test:e2e`    | Run end-to-end tests.                         |

---

## Environment variables

| Variable           | Purpose                                                 |
| ------------------ | ------------------------------------------------------- |
| `PORT`             | HTTP port to listen on (e.g. `3001`).                   |
| `CLERK_SECRET_KEY` | Clerk secret key used to verify session tokens.         |
| `RBMQ_URL`         | RabbitMQ connection URL used to reach the microservices.|

> The code reads `RBMQ_URL`. If your `.env` uses a different name for the queue
> URL, align the two so the gateway can connect.
