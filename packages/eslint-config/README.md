# `@repo/eslint-config` — shared ESLint configuration

A collection of shared **ESLint configurations** used across the Aptly monorepo,
so every app and package lints against the same rules.

> Part of the [Aptly monorepo](../../README.md).

---

## Available configs

The package exposes three configurations through its `exports` map:

| Import path                      | Use it for                                          |
| -------------------------------- | --------------------------------------------------- |
| `@repo/eslint-config/base`       | Base rules for any TypeScript project.              |
| `@repo/eslint-config/next-js`    | Next.js apps (adds Next.js-specific rules).         |
| `@repo/eslint-config/react-internal` | Internal React component packages.              |

---

## Usage

Consumed as a workspace dependency (`"@repo/eslint-config": "*"`). In an app's
flat ESLint config (`eslint.config.js`):

```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```

---

## What it includes

The configs bundle commonly used plugins such as:

- `typescript-eslint`
- `eslint-plugin-react` and `eslint-plugin-react-hooks`
- `@next/eslint-plugin-next`
- `eslint-plugin-turbo`
- `eslint-config-prettier` (so Prettier handles formatting)
- `eslint-plugin-only-warn` (downgrades errors to warnings during development)
