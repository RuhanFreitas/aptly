import { Injectable } from '@nestjs/common'
import { PDFParse, TextResult } from 'pdf-parse'

@Injectable()
export class PDFParseService {
    async parse(URL: string): Promise<TextResult> {
        const parser = new PDFParse({ url: URL })

        const content = await parser.getText()
        return content
    }
}
