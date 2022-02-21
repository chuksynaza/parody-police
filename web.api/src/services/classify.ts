import config from "config";

import { AnalyzedClassificationRequest, ClassificationResponse, ModelsPrediction } from "../models";

export const predict = async (predictionRequest: AnalyzedClassificationRequest): Promise<ModelsPrediction | null> => {
    try {
        const predictionResponse = await fetch(`${config.mlEngineHost}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(predictionRequest)
        });
        if(!predictionResponse.ok) return null;
        return await predictionResponse.json() as ModelsPrediction;
    } catch(error) {
        return null;
    }
}