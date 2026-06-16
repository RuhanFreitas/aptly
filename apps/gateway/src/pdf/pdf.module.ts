import { Module } from '@nestjs/common'
import { PDFService } from './pdf.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    controllers: [],
    providers: [PDFService],
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'PDF_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                    const url = config.get<string>('RBMQ_PDFSERVICE_URL')

                    if (!url) {
                        throw new Error('RBMQ_PDFSERVICE_URL is not defined')
                    }

                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [url],
                            queue: 'pdf_queue',
                            queueOptions: {
                                durable: false,
                            },
                        },
                    }
                },
            },
        ]),
    ],
    exports: [PDFService],
})
export class PDFModule {}
