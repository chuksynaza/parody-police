import config from "../config";

export interface ClassificationRequest {
    title: string;
    body: string;
    url?: string | undefined;
}

export enum SentimentCategory {
    positive = 0,
    negative = 1,
    neutral = 2,
    mixed = 3
}

export type AnalyzedClassification = ClassificationRequest & {
    searchEstimatedMatches: number | null;
    searchUniqueDomainCount: number | null;
    titleSentimentCategory: SentimentCategory | null;
    titleSentimentPositiveScore: number | null;
    titleSentimentNegativeScore: number | null;
    titleSentimentNeutralScore: number | null;
    bodySentimentCategory: SentimentCategory | null;
    bodySentimentPositiveScore: number | null;
    bodySentimentNegativeScore: number | null;
    bodySentimentNeutralScore: number | null;
}

export interface ModelsPrediction {
    [modelName: string]: number;
}

export type ClassificationResult = AnalyzedClassification & {
    modelPredictions: ModelsPrediction;
    averagePrediction: number;
    _id?: string;
}

export const classifyArticle = async (classificationRequest: ClassificationRequest): Promise<ClassificationResult | null> => {
    try {
        const classificationResponse = await fetch(`${config.webApiHost}/classifications`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classificationRequest)
            }
        );
        if (!classificationResponse.ok) return null;
        return await classificationResponse.json() as ClassificationResult;
    } catch (error) {
        console.error("Error retrieving classification results", error);
    }
    return null;
} 

export const getClassification = async (classificationId: string): Promise<ClassificationResult | null> => {
    try {
        const classificationResponse = await fetch(`${config.webApiHost}/classifications/${classificationId}`);
        if (!classificationResponse.ok) return null;
        return await classificationResponse.json() as ClassificationResult;
    } catch (error) {
        console.error("Error retrieving classification", error);
    }
    return null;
} 