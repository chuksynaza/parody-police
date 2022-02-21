import mongoose, { Schema, Document, model } from 'mongoose';

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

export type AnalyzedClassificationRequest = ClassificationRequest & {
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

export type ClassificationResponse = AnalyzedClassificationRequest & {
    modelPredictions: ModelsPrediction;
    averagePrediction: number;
}

const ClassificationSchema = new Schema({
    title: String,
    body: String,
    url: String,
    searchEstimatedMatches: Number,
    searchUniqueDomainCount: Number,
    titleSentimentCategory: Number,
    titleSentimentPositiveScore: Number,
    titleSentimentNegativeScore: Number,
    titleSentimentNeutralScore: Number,
    bodySentimentCategory: Number,
    bodySentimentPositiveScore: Number,
    bodySentimentNegativeScore: Number,
    bodySentimentNeutralScore: Number,
    modelPredictions: Object,
    averagePrediction: Number
  });

export const Classification = model<ClassificationResponse & Document>('Classification', ClassificationSchema);