import { Module } from '@nestjs/common'
import { GroqService } from './groq/groq.service'
import { AiService } from './ai.service'

@Module({
    controllers: [],
    providers: [
        {
            provide: AiService,
            useClass: GroqService,
        },
    ],
    exports: [AiService],
    imports: [],
})
export class AiModule {}
