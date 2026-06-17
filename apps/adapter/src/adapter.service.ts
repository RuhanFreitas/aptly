import { Inject, Injectable } from '@nestjs/common'
import { AiService } from './ai-service/ai.service'

@Injectable()
export class AdapterService {
    constructor(@Inject(AiService) private readonly aiService: AiService) {}

    async adapt() {
        return this.aiService.adapt()
    }
}
