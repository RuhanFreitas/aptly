import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

type metricValue = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1

export interface LanguageMetrics {
    directness: metricValue
    detailLevel: metricValue
    readingComfort: metricValue
    focusAssistance: metricValue
    guidance: metricValue
    simplification: metricValue
    contextExpansion: metricValue
    visualIntensity: metricValue
}

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
