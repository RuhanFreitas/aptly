import { Controller, Get } from '@nestjs/common'
import { AdapterService } from './adapter.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { LanguageMetrics } from './ai-service/groq/groq.service'

@Controller()
export class AdapterController {
    constructor(private readonly adapterService: AdapterService) {}

    @MessagePattern('aptly.event.adapt')
    async adapt(
        @Payload()
        payload: {
            languageMetrics: LanguageMetrics
            content: string
        },
    ) {
        return this.adapterService.adapt(
            payload.languageMetrics,
            payload.content,
        )
    }
}
