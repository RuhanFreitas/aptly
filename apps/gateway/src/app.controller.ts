import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { PDFService } from './pdf/pdf.service'

@Controller('test')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly pdfService: PDFService,
    ) {}

    @Get('test')
    async test() {
        return 'hello'
    }

    @Post('hello')
    async testParse(@Body() data: { url: string }) {
        return this.pdfService.parsePDF(data.url)
    }
}
