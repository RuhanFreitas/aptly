# `@aptly/dtos` — shared data transfer objects

Shared, **runtime-validated** data transfer objects (DTOs) used by the Aptly
backend services. While [`@aptly/types`](../types/README.md) describes shapes at
compile time, this package validates the same data at runtime using
[`class-validator`](https://github.com/typestack/class-validator).

> Part of the [Aptly monorepo](../../README.md).

---

## What's inside

### `LanguageMetricsDTO`

The eight adaptation dimensions, each validated to be a number between `0` and
`1`:

```ts
export class LanguageMetricsDTO {
  @Min(0) @Max(1) @IsNumber() directness: number;
  @Min(0) @Max(1) @IsNumber() detailLevel: number;
  @Min(0) @Max(1) @IsNumber() readingComfort: number;
  @Min(0) @Max(1) @IsNumber() focusAssistance: number;
  @Min(0) @Max(1) @IsNumber() guidance: number;
  @Min(0) @Max(1) @IsNumber() simplification: number;
  @Min(0) @Max(1) @IsNumber() contextExpansion: number;
  @Min(0) @Max(1) @IsNumber() visualIntensity: number;
}
```

It is exported as the package's default export.

---

## Usage

Consumed as a workspace dependency (`"@aptly/dtos": "*"`):

```ts
import LanguageMetricsDTO from "@aptly/dtos";
```

The decorators let NestJS validate incoming requests automatically (with a
validation pipe), so invalid values are rejected before reaching business logic.

---

## Dependencies

- `class-validator` — the validation decorators.
- `class-transformer` — converts plain objects into class instances.
