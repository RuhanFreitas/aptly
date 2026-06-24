import LanguageMetricsDTO from '@aptly/dtos'

export abstract class AiService {
    adapt(languageMetrics: LanguageMetricsDTO, content: string): any {}
}
