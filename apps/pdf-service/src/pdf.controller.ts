import { Controller, Get } from '@nestjs/common'
import { PDFService } from './pdf.service'
import { EventPattern, Payload } from '@nestjs/microservices'
import { TextResult } from 'pdf-parse'

@Controller()
export class PDFController {
    constructor(private readonly pdfService: PDFService) {}

    @EventPattern('aptly.event.parse_pdf')
    async parsePDF(@Payload() data: { url: string }): Promise<TextResult> {
        return this.pdfService.parsePDF(data.url)
    }
}
