import { Controller, Get } from '@nestjs/common'
import { AdapterService } from './adapter.service'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class AdapterController {
    constructor(private readonly adapterService: AdapterService) {}

    @MessagePattern('aptly.event.adapt')
    async adapt() {
        return this.adapterService.adapt()
    }
}
