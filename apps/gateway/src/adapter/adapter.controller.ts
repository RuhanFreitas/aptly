import type { LanguageMetrics } from '@aptly/types'
import { Body, Controller, Post } from '@nestjs/common'
import { PDFService } from '../pdf/pdf.service'
import { AdapterService } from './adapter.service'

@Controller('adapter')
export class AdapterController {
    constructor(
        private readonly pdfService: PDFService,
        private readonly apdaterService: AdapterService,
    ) {}

    @Post('')
    async adapt(
        @Body() body: { languageMetrics: LanguageMetrics; url: string },
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
