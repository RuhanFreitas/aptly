import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AdapterService {
    constructor(
        @Inject('ADAPTER_SERVICE') private readonly adapterClient: ClientProxy,
    ) {}

    async adapt() {
        const response = this.adapterClient.send('aptly.event.adapt', {})

        return firstValueFrom(response)
    }
}
