import config from "../config";

export interface ScrapeResult {
    title: string;
    body: string;
}

export const scrapeWebsite = async (url: string): Promise<ScrapeResult | null> => {
    try {
        const scrapeWebsiteResponse = await fetch(`${config.webApiHost}/scrape?url=${url}`);
        if (!scrapeWebsiteResponse.ok) return null;
        return await scrapeWebsiteResponse.json() as ScrapeResult;
    } catch (error) {
        console.error("Error retrieving scrape results", error);
    }
    return null;
} 