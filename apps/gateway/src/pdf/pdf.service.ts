import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class PDFService {
    constructor(
        @Inject('PDF_SERVICE')
        private readonly client: ClientProxy,
    ) {}

    async parsePDF(url: string) {
        const response = this.client.send('aptly.event.parse_pdf', {
            url,
        })

        return firstValueFrom(response)
    }
}
