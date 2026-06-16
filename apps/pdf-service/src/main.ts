import { NestFactory } from '@nestjs/core'
import { PdfModule } from './pdf.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        PdfModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL!],
                queue: 'pdf_queue',
                queueOptions: {
                    durable: false,
                },
            },
        },
    )

    await app.listen()
}
bootstrap()
