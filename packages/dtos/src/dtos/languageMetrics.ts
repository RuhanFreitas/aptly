import { IsNumber, Max, Min } from 'class-validator'

export class LanguageMetricsDTO {
    @Min(0)
    @Max(1)
    @IsNumber()
    directness: number

    @Min(0)
    @Max(1)
    @IsNumber()
    detailLevel: number

    @Min(0)
    @Max(1)
    @IsNumber()
    readingComfort: number

    @Min(0)
    @Max(1)
    @IsNumber()
    focusAssistance: number

    @Min(0)
    @Max(1)
    @IsNumber()
    guidance: number

    @Min(0)
    @Max(1)
    @IsNumber()
    simplification: number

    @Min(0)
    @Max(1)
    @IsNumber()
    contextExpansion: number

    @Min(0)
    @Max(1)
    @IsNumber()
    visualIntensitiy: number
}
