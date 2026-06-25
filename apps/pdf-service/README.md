# `pdf-service` — Aptly PDF extraction service

A small, focused microservice with one job: **take a PDF link and return its
text.** Aptly can only adapt content it can read, so this service turns a PDF
into plain text that the [`adapter`](../adapter/README.md) can then rewrite.

It is a **NestJS microservice** that listens on a **RabbitMQ** queue. It has no
HTTP endpoints; it only reacts to messages from the [`gateway`](../gateway/README.md).

> Part of the [Aptly monorepo](../../README.md).

---

## How it fits in

```
Gateway ──RabbitMQ──▶ pdf-service ──▶ downloads + parses the PDF ──▶ text ──▶ Gateway
            (pdf_queue, event "aptly.event.parse_pdf")
```

---

## What it listens for

### Event: `aptly.event.parse_pdf`

**Payload**

```ts
{
  url: string; // a link to a PDF document
}
```

**Returns** the parsed result from [`pdf-parse`](https://www.npmjs.com/package/pdf-parse),
which includes the extracted `text` along with other metadata.

---

## How it works

The service uses the `pdf-parse` library to fetch the PDF directly from the URL
and extract its text. The logic is split into two thin layers:

- `PDFService` — the entry point called by the controller.
- `PDFParseService` — wraps the `pdf-parse` library and does the actual parsing.

This separation keeps the parsing library isolated, so it can be replaced or
extended (for example, OCR for scanned PDFs) without changing the rest of the app.

---

## Project structure

```
apps/pdf-service/
├── src/
│   ├── main.ts                  Bootstraps the RabbitMQ microservice
│   ├── pdf.module.ts            Root module
│   ├── pdf.controller.ts        Listens for "aptly.event.parse_pdf"
│   ├── pdf.service.ts           Coordinates parsing
│   └── pdf-parse.service.ts     Wraps the pdf-parse library
```

---

## Getting started

From the repository root, install dependencies once:

```bash
npm install
```

Copy the example environment file and fill it in:

```bash
cp apps/pdf-service/.env.example apps/pdf-service/.env
```

With **RabbitMQ** running, start the service:

```bash
# from the repo root
npm run dev --workspace=pdf-service

# or from this folder
npm run dev
```

The service connects to the `pdf_queue` queue and waits for messages.

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

| Variable     | Purpose                  |
| ------------ | ------------------------ |
| `RBMQ_URL`   | RabbitMQ connection URL.  |

> The code reads `RBMQ_URL` for the queue connection. If your `.env` uses a
> different name, align the two so the service can connect.
