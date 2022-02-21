import { Request, Response } from "express";
import { scrapeHandlers } from "../services";

export const scrapeArticleOffWebsite = async (request: Request, response: Response) => {
    const scrapeUrl = request.query.url.toString();
    const scrapeUrlMatch = scrapeUrl.match(/(https?:\/\/)(www.)?([^\/]*)(\/){0,1}(.*)/);
    if(scrapeUrlMatch){
        const domainName = scrapeUrlMatch[3];
        console.log("Domain", domainName)
        if(scrapeHandlers[domainName]){
            const scrapeResult = await scrapeHandlers[domainName](scrapeUrl);
            if(scrapeResult){
                response.json(scrapeResult);
                return;
            }
        }
    }
    response.status(400).json({ error: 'Unsupported URL' });
}