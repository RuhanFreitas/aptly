import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { PDFModule } from './pdf-service/pdf.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PDFModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
