const assertDefined = <T, K extends keyof T>(obj: Partial<T>, prop: K): void => {
    if (obj[prop] === undefined || obj[prop] === null) {
        throw new Error(`Environment is missing variable ${prop}`);
    }
};

// Validate required environment variables
[
    "ML_ENGINE_HOST",
    "TWITTER_ENGINE_HOST",
    "TEXT_ANALYTICS_ENDPOINT",
    "TEXT_ANALYTICS_KEY",
    "WEB_SEARCH_COGNITIVE_SERVICES_SUBSCRIPTION_KEY"
    // Currently only runtime config defined
].forEach((v) => assertDefined(process.env, v));


export interface Config {
    mlEngineHost: string;
    twitterEngineHost: string;
    textAnalyticsEndpoint: string;
    textAnalyticsKey: string;
    webSearchCognitiveServiceSubscriptionKey: string;
}

export const config: Config = {
    mlEngineHost: process.env.ML_ENGINE_HOST || '',
    twitterEngineHost: process.env.TWITTER_ENGINE_HOST || '',
    textAnalyticsEndpoint: process.env.TEXT_ANALYTICS_ENDPOINT || '',
    textAnalyticsKey: process.env.TEXT_ANALYTICS_KEY || '',
    webSearchCognitiveServiceSubscriptionKey: process.env.WEB_SEARCH_COGNITIVE_SERVICES_SUBSCRIPTION_KEY || ''
}

export default config