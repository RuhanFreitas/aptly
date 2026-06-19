import type { LanguageMetrics } from '@aptly/types'

export abstract class AiService {
    adapt(languageMetrics: LanguageMetrics, content: string): any {}
}
