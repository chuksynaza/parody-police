import { TextAnalyticsClient, AzureKeyCredential, AnalyzeSentimentResultArray, AnalyzeSentimentErrorResult, AnalyzeSentimentSuccessResult, AnalyzeSentimentResult } from "@azure/ai-text-analytics";

// TODO: Inject from config, env variable
const key = '';
const endpoint = 'https://parody-police-text-analytics-pro.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

export const sentimentAnalysis = async (sentimentInput: string[]): Promise<AnalyzeSentimentResult[]> => {
    try{
        const analysisResults: AnalyzeSentimentResultArray = await textAnalyticsClient.analyzeSentiment(sentimentInput);
        return analysisResults.map(analysisResult => analysisResult);
    } catch(error){
     return [];   
    }
}