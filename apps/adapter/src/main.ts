import { NestFactory } from '@nestjs/core'
import { AdapterModule } from './adapter.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AdapterModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL!],
            queue: 'adapter_queue',
            queueOptions: {
                durable: false,
            },
        },
    })
    await app.listen()
}
bootstrap()
