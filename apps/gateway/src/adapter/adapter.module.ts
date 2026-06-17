import { Module } from '@nestjs/common'
import { AdapterController } from './adapter.controller'
import { AdapterService } from './adapter.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'ADAPTER_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                    const url = config.get<string>('RBMQ_URL')

                    if (!url) {
                        throw new Error('RBMQ_URL is not defined')
                    }

                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [url],
                            queue: 'adapter_queue',
                            queueOptions: {
                                durable: false,
                            },
                        },
                    }
                },
            },
        ]),
    ],
    exports: [AdapterService],
    controllers: [AdapterController],
    providers: [AdapterService],
})
export class AdapterModule {}
