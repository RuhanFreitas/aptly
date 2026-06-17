import { Module } from '@nestjs/common'
import { AdapterController } from './adapter.controller'
import { AdapterService } from './adapter.service'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [AdapterController],
    providers: [AdapterService],
})
export class AdapterModule {}
