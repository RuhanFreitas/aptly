import { LanguageMetrics } from './groq/groq.service'

export abstract class AiService {
    adapt(languageMetrics: LanguageMetrics, content: string): any {}
}
