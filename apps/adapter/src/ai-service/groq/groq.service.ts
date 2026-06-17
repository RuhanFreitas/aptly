import { Injectable } from '@nestjs/common'
import { AiService } from '../ai.service'
import Groq from 'groq-sdk'

@Injectable()
export class GroqService implements AiService {
    groq: Groq

    constructor() {
        this.groq = new Groq()
    }

    async adapt() {
        const response = await this.groq.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            messages: [
                {
                    role: 'system',
                    content: `

                    You're a history professor. Give me a lecture.

                    Always return your response in JSON.
                    
                    `,
                },
                {
                    role: 'user',
                    content: 'veg lasgna recipe',
                },
            ],
            response_format: {
                type: 'json_object',
            },
        })

        const result = JSON.parse(response.choices[0]?.message.content || '{}')

        return result
    }
}
