import { Module } from '@nestjs/common'
import { AdapterController } from './adapter.controller'
import { AdapterService } from './adapter.service'
import { ConfigModule } from '@nestjs/config'
import { AiModule } from './ai-service/ai.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AiModule,
    ],
    controllers: [AdapterController],
    providers: [AdapterService],
})
export class AdapterModule {}
