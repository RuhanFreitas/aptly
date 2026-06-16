import { Module } from '@nestjs/common'
import { PDFService } from './pdf.service'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [PDFService],
    providers: [PDFService],
})
export class PdfModule {}
