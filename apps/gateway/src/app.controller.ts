import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { PDFService } from './pdf/pdf.service'
import { AdapterService, LanguageMetrics } from './adapter/adapter.service'

@Controller('test')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly pdfService: PDFService,
        private readonly adapterService: AdapterService,
    ) {}

    @Get('test')
    async test() {
        return 'hello'
    }

    @Post('hello')
    async testParse(@Body() data: { url: string }) {
        return this.pdfService.parsePDF(data.url)
    }

    @Post('ai')
    async testAi(@Body() data: { url: string }) {
        const languageMetrics: LanguageMetrics = {
            directness: 1,
            detailLevel: 0.5,
            readingComfort: 0.5,
            focusAssistance: 0.5,
            guidance: 1,
            simplification: 0,
            contextExpansion: 0.5,
            visualIntensity: 0.5,
        }

        const content = await this.pdfService.parsePDF(data.url)

        const str = JSON.stringify(content)

        return await this.adapterService.adapt(languageMetrics, str)
    }
}
