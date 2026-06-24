import { Injectable } from '@nestjs/common'
import { AiService } from '../ai.service'
import Groq from 'groq-sdk'
import LanguageMetricsDTO from '@aptly/dtos'

@Injectable()
export class GroqService implements AiService {
    groq: Groq
    private readonly CHUNK_SIZE_LIMIT = 16000

    constructor() {
        this.groq = new Groq()
    }

    async adapt(languageMetrics: LanguageMetricsDTO, content: string) {
        if (content.length <= this.CHUNK_SIZE_LIMIT) {
            return this.callGroqApi(languageMetrics, content)
        }

        const chunks = this.splitContentIntoChunks(
            content,
            this.CHUNK_SIZE_LIMIT,
        )
        const results: any[] = []

        for (const chunk of chunks) {
            const chunkResult = await this.callGroqApi(languageMetrics, chunk)
            if (chunkResult) {
                results.push(chunkResult)
            }
        }

        return this.consolidateResults(results)
    }

    private async callGroqApi(
        languageMetrics: LanguageMetricsDTO,
        chunkContent: string,
    ) {
        try {
            const response = await this.groq.chat.completions.create({
                model: 'openai/gpt-oss-120b',
                messages: [
                    {
                        role: 'system',
                        content: `

                    # Role

                    You are an expert neurologist, neuroscientist, 
                    and highly skilled professional writer with exceptional abilities in communication, 
                    education, and content adaptation.

                    Your task is to rewrite the provided text while preserving its original meaning,
                    factual accuracy, and intent. Adapt the content according to the parameters defined below.

                    ---

                    # Instructions

                    Analyze the input text and rewrite it based on the following dimensions. 
                    Each dimension receives a value between **0.0 and 1.0**, where:

                    * **0.0 = minimum intensity**
                    * **1.0 = maximum intensity**

                    Apply all dimensions simultaneously when generating the final version.

                    ---

                    ## 1. Directness

                    **Question:** How direct should the content be?

                    ### Low (0.0)

                    * More contextualization
                    * Additional explanations
                    * Gradual transitions
                    * More exploratory writing

                    ### High (1.0)

                    * Highly objective
                    * Concise and efficient
                    * Focus only on essential information
                    * Eliminate unnecessary wording

                    ### Influences

                    * Verbosity
                    * Condensation
                    * Filler removal
                    * Contextual depth

                    Parameter:
                    directness = ${languageMetrics.directness}

                    ---

                    ## 2. Detail Level

                    **Question:** How much detail should be included?

                    ### Low (0.0)

                    * High-level overview
                    * Simplified explanations
                    * Reduced information density

                    ### High (1.0)

                    * Comprehensive explanations
                    * Greater nuance
                    * Technical depth where appropriate
                    * Expanded reasoning

                    ### Influences

                    * Technical depth
                    * Abstraction level
                    * Examples
                    * Elaboration

                    Parameter:
                    detail_level = ${languageMetrics.detailLevel}

                    ---

                    ## 3. Reading Comfort

                    **Question:** How easy and comfortable should the text be to read?

                    ### Low (0.0)

                    * Dense formatting
                    * Fewer visual breaks

                    ### High (1.0)

                    * Shorter paragraphs
                    * Better spacing
                    * Improved reading rhythm
                    * Reduced cognitive load

                    ### Influences

                    * Visual density
                    * Chunking
                    * Line length
                    * Pacing

                    Parameter:
                    reading_comfort = ${languageMetrics.readingComfort}

                    ---

                    ## 4. Focus Assistance

                    **Question:** How much should the text guide the reader's attention?

                    ### Low (0.0)

                    * Natural presentation
                    * Minimal emphasis

                    ### High (1.0)

                    * Highlight key ideas
                    * Prioritize important information
                    * Reduce distractions
                    * Add checkpoints and signposts

                    ### Influences

                    * Prioritization
                    * Highlighting
                    * Guidance
                    * Noise reduction

                    Parameter:
                    focus_assistance = ${languageMetrics.focusAssistance}

                    ---

                    ## 5. Guidance

                    **Question:** How structured should the reading experience be?

                    ### Low (0.0)

                    * Preserve original flow
                    * Minimal intervention

                    ### High (1.0)

                    * Clear sections and headings
                    * Explicit progression
                    * Guided transitions
                    * Summaries when useful

                    ### Influences

                    * Structure
                    * Sequential flow
                    * Navigation
                    * Transitional clarity

                    Parameter:
                    guidance = ${languageMetrics.guidance}

                    ---

                    ## 6. Simplification

                    **Question:** How simple should the language become?

                    ### Low (0.0)

                    * Preserve original vocabulary and complexity

                    ### High (1.0)

                    * Use simpler language
                    * Shorter sentences
                    * Reduce abstraction
                    * Improve accessibility

                    ### Influences

                    * Vocabulary complexity
                    * Sentence complexity
                    * Conceptual complexity

                    Parameter:
                    simplification = ${languageMetrics.simplification}

                    ---

                    ## 7. Context Expansion

                    **Question:** How much supporting context should be added?

                    ### Low (0.0)

                    * Minimal supporting information

                    ### High (1.0)

                    * Additional explanations
                    * Relevant examples
                    * Inline definitions
                    * Reinforcement of key concepts

                    ### Influences

                    * Contextual expansion
                    * Example frequency
                    * Clarification
                    * Reinforcement

                    Parameter:
                    context_expansion = ${languageMetrics.contextExpansion}

                    ---

                    ## 8. Visual Intensity

                    **Question:** How much visual emphasis should be used?

                    ### Low (0.0)

                    * Minimal formatting
                    * Subtle emphasis
                    * Calm visual presentation

                    ### High (1.0)

                    * Strong visual hierarchy
                    * More differentiation between sections
                    * Greater emphasis on important information

                    ### Influences

                    * Contrast
                    * Visual separation
                    * Highlight intensity
                    * Hierarchy

                    Parameter:
                    visual_intensity = ${languageMetrics.visualIntensity}

                    ---

                    # Output Requirements

                    1. Preserve the original meaning and factual accuracy.
                    2. Do not introduce unsupported claims.
                    3. Adapt style, structure, and presentation according to the parameter values.
                    4. Optimize readability and comprehension.
                    5. Maintain a professional, educational, and trustworthy tone.
                    6. Return only the rewritten content unless explicitly asked to explain changes.
                    7. If the text contains medical or scientific information, preserve technical correctness while adjusting complexity according to the Simplification and Detail Level parameters.
                    8. Return the answer in JSON format.
                    {
                    
                    `,
                    },
                    {
                        role: 'user',
                        content: `${chunkContent}`,
                    },
                ],
                response_format: {
                    type: 'json_object',
                },
            })

            return JSON.parse(response.choices[0]?.message.content || '{}')
        } catch (error) {
            console.error('Error processing block in Groq:', error)
            throw error
        }
    }

    private splitContentIntoChunks(text: string, maxLength: number): string[] {
        const chunks: string[] = []
        let currentIndex = 0

        while (currentIndex < text.length) {
            let chunkEnd = currentIndex + maxLength

            if (chunkEnd < text.length) {
                const lastSpace = text.lastIndexOf(' ', chunkEnd)
                if (lastSpace > currentIndex) {
                    chunkEnd = lastSpace
                }
            }

            chunks.push(text.substring(currentIndex, chunkEnd).trim())
            currentIndex = chunkEnd
        }

        return chunks
    }

    private consolidateResults(results: any[]) {
        const mergedText = results
            .map(
                (res) =>
                    res.text ||
                    res.content ||
                    res.adapted_content ||
                    JSON.stringify(res),
            )
            .join('\n\n')

        return {
            adapted_content: mergedText,
        }
    }
}
