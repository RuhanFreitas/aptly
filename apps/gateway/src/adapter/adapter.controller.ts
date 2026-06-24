import { Body, Controller, Post } from '@nestjs/common'
import { PDFService } from '../pdf/pdf.service'
import { AdapterService } from './adapter.service'
import LanguageMetricsDTO from '@aptly/dtos'

@Controller('adapter')
export class AdapterController {
    constructor(
        private readonly pdfService: PDFService,
        private readonly apdaterService: AdapterService,
    ) {}

    @Post('')
    async adapt(
        @Body() body: { languageMetrics: LanguageMetricsDTO; url: string },
    ) {
        const pdfResult = await this.pdfService.parsePDF(body.url)
        const content = pdfResult.text

        if (!content?.trim()) {
            throw new Error('PDF contains no extractable text')
        }

        const adaptedContent = await this.apdaterService.adapt(
            body.languageMetrics,
            content,
        )

        return adaptedContent
    }
}
