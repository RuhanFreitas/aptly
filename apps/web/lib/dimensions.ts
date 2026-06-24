import {
  ArrowRightLeft,
  Layers,
  Wind,
  Target,
  Route,
  Sparkles,
  BookOpen,
  Contrast,
  type LucideIcon,
} from "lucide-react";

/**
 * The eight adaptation dimensions exposed to users.
 *
 * These keys map 1:1 to the backend `LanguageMetricsDTO`. Each value is a
 * normalized intensity between 0 and 1. The copy here mirrors the product
 * specification: intentionally simple cognitive controls that sit on top of a
 * much deeper transformation engine.
 */
export type DimensionKey =
  | "directness"
  | "detailLevel"
  | "readingComfort"
  | "focusAssistance"
  | "guidance"
  | "simplification"
  | "contextExpansion"
  | "visualIntensity";

export type LanguageMetrics = Record<DimensionKey, number>;

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  question: string;
  icon: LucideIcon;
  lowLabel: string;
  highLabel: string;
  low: string[];
  high: string[];
  controls: string[];
}

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: "directness",
    label: "Directness",
    question: "How direct should the content be?",
    icon: ArrowRightLeft,
    lowLabel: "Exploratory",
    highLabel: "Objective",
    low: ["More context", "Additional explanation", "Smoother transitions"],
    high: ["Objective", "No beating around the bush", "Focus on the essentials"],
    controls: ["Verbosity", "Condensation", "Filler removal", "Contextual depth"],
  },
  {
    key: "detailLevel",
    label: "Detail level",
    question: "How much detail do you want?",
    icon: Layers,
    lowLabel: "Overview",
    highLabel: "In depth",
    low: ["Simplification", "Overview", "Lower density"],
    high: ["Depth", "Comprehensive explanations", "Nuance"],
    controls: ["Technical depth", "Abstraction", "Examples", "Expansion"],
  },
  {
    key: "readingComfort",
    label: "Reading comfort",
    question: "Make reading easier and calmer.",
    icon: Wind,
    lowLabel: "Compact",
    highLabel: "Spacious",
    low: ["Denser layout", "Fewer visual breaks"],
    high: ["Spacing", "Chunking", "Calmer reading rhythm"],
    controls: ["Visual density", "Line width", "Chunking size", "Pacing"],
  },
  {
    key: "focusAssistance",
    label: "Focus assistance",
    question: "Reduce distractions and improve focus.",
    icon: Target,
    lowLabel: "Natural",
    highLabel: "Guided focus",
    low: ["Natural presentation", "Minimal emphasis"],
    high: ["Highlight key points", "Reduce noise", "Add checkpoints"],
    controls: ["Highlighting", "Prioritization", "Guidance", "Distraction reduction"],
  },
  {
    key: "guidance",
    label: "Guidance",
    question: "How guided should the reading experience feel?",
    icon: Route,
    lowLabel: "Original flow",
    highLabel: "Structured",
    low: ["Natural, original content"],
    high: ["Extra headings", "Explicit structure", "Guided progression"],
    controls: ["Structural guidance", "Sequential flow", "Summaries", "Transitions"],
  },
  {
    key: "simplification",
    label: "Simplification",
    question: "How simplified should the language be?",
    icon: Sparkles,
    lowLabel: "Original",
    highLabel: "Simplified",
    low: ["Preserve the original language"],
    high: ["Simpler sentences", "Less abstraction", "Less complexity"],
    controls: ["Vocabulary complexity", "Sentence complexity", "Abstraction"],
  },
  {
    key: "contextExpansion",
    label: "Context",
    question: "How much supporting context should be added?",
    icon: BookOpen,
    lowLabel: "Lean",
    highLabel: "Enriched",
    low: ["Lean, minimal content"],
    high: ["Examples", "Explanations", "Inline definitions"],
    controls: ["Context expansion", "Example frequency", "Reinforcement"],
  },
  {
    key: "visualIntensity",
    label: "Visual intensity",
    question: "Adjust the visual stimulation level.",
    icon: Contrast,
    lowLabel: "Minimal",
    highLabel: "Emphatic",
    low: ["More minimal", "Lower contrast", "Softer treatment"],
    high: ["More visual emphasis", "More differentiation"],
    controls: ["Contrast", "Highlight intensity", "Visual separation"],
  },
];

/** Presets give people a calm starting point instead of a blank slate. */
export interface Preset {
  id: string;
  name: string;
  description: string;
  metrics: LanguageMetrics;
}

const m = (values: Partial<LanguageMetrics>): LanguageMetrics => ({
  directness: 0.5,
  detailLevel: 0.5,
  readingComfort: 0.5,
  focusAssistance: 0.5,
  guidance: 0.5,
  simplification: 0.5,
  contextExpansion: 0.5,
  visualIntensity: 0.5,
  ...values,
});

export const DEFAULT_METRICS: LanguageMetrics = m({});

export const PRESETS: Preset[] = [
  {
    id: "balanced",
    name: "Balanced",
    description: "A neutral starting point. Light touch across every dimension.",
    metrics: m({}),
  },
  {
    id: "focus",
    name: "Deep focus",
    description: "Quiet, guided and distraction-free for long reading sessions.",
    metrics: m({
      readingComfort: 0.8,
      focusAssistance: 0.9,
      guidance: 0.7,
      visualIntensity: 0.3,
      directness: 0.6,
    }),
  },
  {
    id: "skim",
    name: "Quick brief",
    description: "Objective and condensed. Get the essentials, fast.",
    metrics: m({
      directness: 0.9,
      detailLevel: 0.2,
      simplification: 0.6,
      contextExpansion: 0.2,
      guidance: 0.6,
    }),
  },
  {
    id: "study",
    name: "Study mode",
    description: "Rich context, worked examples and clear structure to learn from.",
    metrics: m({
      detailLevel: 0.8,
      contextExpansion: 0.85,
      guidance: 0.8,
      readingComfort: 0.7,
      focusAssistance: 0.6,
    }),
  },
  {
    id: "plain",
    name: "Plain language",
    description: "Maximum simplicity for low cognitive load and easy comprehension.",
    metrics: m({
      simplification: 0.95,
      directness: 0.7,
      detailLevel: 0.3,
      readingComfort: 0.85,
      visualIntensity: 0.4,
    }),
  },
];
