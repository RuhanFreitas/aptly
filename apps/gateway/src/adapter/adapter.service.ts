import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import LanguageMetricsDTO from '@aptly/dtos'

@Injectable()
export class AdapterService {
    constructor(
        @Inject('ADAPTER_SERVICE') private readonly adapterClient: ClientProxy,
    ) {}

    async adapt(languageMetrics: LanguageMetricsDTO, content: string) {
        const response = this.adapterClient.send('aptly.event.adapt', {
            languageMetrics,
            content,
        })

        return firstValueFrom(response)
    }
}
