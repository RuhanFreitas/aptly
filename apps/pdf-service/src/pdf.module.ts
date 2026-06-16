import { Module } from '@nestjs/common'
import { PDFService } from './pdf.service'
import { ConfigModule } from '@nestjs/config'
import { PDFParseService } from './pdf-parse.service'
import { PDFController } from './pdf.controller'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [PDFController],
    providers: [PDFService, PDFParseService],
})
export class PdfModule {}
