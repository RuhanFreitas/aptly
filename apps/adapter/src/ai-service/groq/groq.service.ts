import { Injectable } from '@nestjs/common'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { AiService } from '../ai.service'

@Injectable()
export class GroqService implements AiService {
    async adapt() {
        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: 'Write a vegetarian lasagna recipe for 4 people.',
        })

        return text
    }
}
