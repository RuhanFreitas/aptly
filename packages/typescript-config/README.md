# `@repo/typescript-config` — shared TypeScript configs

Shared **TypeScript configuration presets** (`tsconfig`) used across the Aptly
monorepo. Apps and packages extend these base configs instead of repeating the
same compiler options everywhere, so settings stay consistent.

> Part of the [Aptly monorepo](../../README.md).

---

## Usage

Consumed as a workspace dependency (`"@repo/typescript-config": "*"`). A project
extends one of the shared presets in its own `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

Pick the preset that matches the project type:

| Preset                                       | Use it for                                  |
| -------------------------------------------- | ------------------------------------------- |
| `@repo/typescript-config/base.json`          | Base options shared by everything.          |
| `@repo/typescript-config/nest.json`          | NestJS services (gateway, adapter, pdf).    |
| `@repo/typescript-config/nextjs.json`        | The Next.js web app.                        |
| `@repo/typescript-config/react-library.json` | Shared React component libraries.           |

---

## Why it exists

Centralizing compiler options means:

- One place to update strictness, module settings, and targets.
- Consistent type-checking behavior across every workspace.
- Less boilerplate in each project's `tsconfig.json`.
