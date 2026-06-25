# `@aptly/types` — shared TypeScript types

A tiny, dependency-free package of **shared TypeScript types** used across the
Aptly backend services. It is type-only: it ships no runtime code, just type
definitions that keep every service in agreement about the shape of the data.

> Part of the [Aptly monorepo](../../README.md).

---

## What's inside

| Type             | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `LanguageMetrics`| The eight adaptation dimensions as a typed object.                       |
| `metricValue`    | A value in 0.1 steps from `0` to `1` (`0`, `0.1`, … `1`).                |

```ts
export type LanguageMetrics = {
  directness: metricValue;
  detailLevel: metricValue;
  readingComfort: metricValue;
  focusAssistance: metricValue;
  guidance: metricValue;
  simplification: metricValue;
  contextExpansion: metricValue;
  visualIntensity: metricValue;
};
```

---

## Usage

It is consumed as a workspace dependency (`"@aptly/types": "*"`) and imported
with type-only imports:

```ts
import type { LanguageMetrics } from "@aptly/types";
```

The package exposes only types via its `exports` map, so nothing is bundled at
runtime.

---

## Related

For the **validated** version used at runtime in the backend (with
`class-validator` decorators), see [`@aptly/dtos`](../dtos/README.md).
