import { Request, Response } from "express";
import { sentimentAnalysis, webSearch, getUniqueWebPageDomains, predict } from "../services";
import { ClassificationRequest, SentimentCategory, AnalyzedClassificationRequest, ClassificationResponse, Classification } from '../models';
import { AnalyzeSentimentSuccessResult } from '@azure/ai-text-analytics';

const analyzeRequest = async (classificationRequest: ClassificationRequest): Promise<AnalyzedClassificationRequest> => {
    console.log("Analyzing Request", classificationRequest.title);
    const searchAnalysisResult = await webSearch(classificationRequest.title.substr(0, 3000).toLowerCase());
    console.log('Search Result', searchAnalysisResult);
    const sentimentAnalysisResult = await sentimentAnalysis([classificationRequest.title.substr(0, 3000).toLowerCase(), classificationRequest.body.substr(0, 3000).toLowerCase()]);
    const analysedRequest: AnalyzedClassificationRequest = {
        ...classificationRequest,
        searchEstimatedMatches: (searchAnalysisResult && searchAnalysisResult.webPages) ? searchAnalysisResult.webPages.totalEstimatedMatches : null,
        searchUniqueDomainCount: (searchAnalysisResult && searchAnalysisResult.webPages) ? getUniqueWebPageDomains(searchAnalysisResult).length : null,
        titleSentimentCategory: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[0].error) ? SentimentCategory[(sentimentAnalysisResult[0] as AnalyzeSentimentSuccessResult).sentiment] : null,
        titleSentimentPositiveScore: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[0].error) ? (sentimentAnalysisResult[0] as AnalyzeSentimentSuccessResult).confidenceScores.positive : null,
        titleSentimentNegativeScore: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[0].error) ? (sentimentAnalysisResult[0] as AnalyzeSentimentSuccessResult).confidenceScores.negative : null,
        titleSentimentNeutralScore: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[0].error) ? (sentimentAnalysisResult[0] as AnalyzeSentimentSuccessResult).confidenceScores.neutral : null,
        bodySentimentCategory: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[1].error) ? SentimentCategory[(sentimentAnalysisResult[1] as AnalyzeSentimentSuccessResult).sentiment] : null,
        bodySentimentPositiveScore: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[1].error) ? (sentimentAnalysisResult[1] as AnalyzeSentimentSuccessResult).confidenceScores.positive : null,
        bodySentimentNegativeScore: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[1].error) ? (sentimentAnalysisResult[1] as AnalyzeSentimentSuccessResult).confidenceScores.negative : null,
        bodySentimentNeutralScore: (sentimentAnalysisResult && sentimentAnalysisResult.length == 2 && !sentimentAnalysisResult[1].error) ? (sentimentAnalysisResult[1] as AnalyzeSentimentSuccessResult).confidenceScores.neutral : null
    }
    return analysedRequest;
}

export const classifyArticle = async (request: Request, response: Response) => {
    const requestBody = request.body;
    console.log("Request Bodyyy", requestBody);
    if (requestBody.title && requestBody.body) {
        const analyzedRequest = await analyzeRequest(requestBody as ClassificationRequest);
        console.log("Analyzed Request: ", analyzedRequest);
        if (Object.values(analyzedRequest).some(value => value === null)) {
            response.status(500).json({ error: 'Error Peforming Analysis' });
            return;
        }
        const predictionResults = await predict(analyzedRequest);
        if (!predictionResults || Object.keys(predictionResults).length < 1) {
            response.status(500).json({ error: 'No predictions returned' });
            return;
        }
        let predictionSum = 0;
        Object.values(predictionResults).forEach(predictionResult => predictionSum += predictionResult);
        const averagePrediction = predictionSum / Object.keys(predictionResults).length;
        const classificationResult: ClassificationResponse = { ...analyzedRequest, modelPredictions: predictionResults, averagePrediction }
        const classificationDocument = new Classification(classificationResult);
        classificationDocument.save();
        console.log("Classificaton Document id", classificationDocument.id);
        response.json(classificationDocument);
        return;
    }
    response.status(400).json({ error: 'Invalid Classification Request' });
}

export const getClassification = async (request: Request, response: Response) => {
    const classificationId = request.params.classificationId;
    try {
        const classificationResult = await Classification.findById(classificationId);
        if (classificationResult) {
            response.json(classificationResult);
            return;
        }
    } catch (error) {
    }

    response.status(404).json({ error: 'Classification Result Not Found' });
}