import { Injectable } from '@nestjs/common'
import { PDFParse, TextResult } from 'pdf-parse'
import { PDFParseService } from './pdf-parse.service'

@Injectable()
export class PDFService {
    constructor(private readonly pdfParser: PDFParseService) {}

    async parsePDF(URL: string): Promise<TextResult> {
        const content = await this.pdfParser.parse(URL)

        return content
    }
}
