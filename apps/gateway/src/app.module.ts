import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PDFModule } from './pdf/pdf.module'
import { AdapterModule } from './adapter/adapter.module'
import { AdapterController } from './adapter/adapter.controller'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PDFModule,
        AdapterModule,
    ],
    controllers: [AdapterController],
    providers: [],
})
export class AppModule {}
