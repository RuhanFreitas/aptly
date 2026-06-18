import { Inject, Injectable } from '@nestjs/common'
import { AiService } from './ai-service/ai.service'
import { LanguageMetrics } from './ai-service/groq/groq.service'

@Injectable()
export class AdapterService {
    constructor(@Inject(AiService) private readonly aiService: AiService) {}

    async adapt(metrics: LanguageMetrics, content: string) {
        return await this.aiService.adapt(metrics, content)
    }
}
