import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import type { LanguageMetrics } from '@aptly/types'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AdapterService {
    constructor(
        @Inject('ADAPTER_SERVICE') private readonly adapterClient: ClientProxy,
    ) {}

    async adapt(languageMetrics: LanguageMetrics, content: string) {
        const response = this.adapterClient.send('aptly.event.adapt', {
            languageMetrics,
            content,
        })

        return firstValueFrom(response)
    }
}
