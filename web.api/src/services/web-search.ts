import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js';
import {WebSearchClient} from '@azure/cognitiveservices-websearch';
import { WebSearchResponse } from '@azure/cognitiveservices-websearch/esm/models';

// TODO: Inject from config, env variable
const key = '';
const credentials = new CognitiveServicesCredentials(key);
const webSearchApiClient = new WebSearchClient(credentials);

export const webSearch = async (query: string) => {
    return await webSearchApiClient.web.search(query, {
        count: 50,
        responseFilter: ['WebPages']
    });
}

export const getUniqueWebPageDomains = (webSearchResponse: WebSearchResponse) => {
    const uniqueDomains = [];
    if(webSearchResponse.webPages){
        webSearchResponse.webPages.value.forEach(webPage => {
            if(webPage.url){
                const domainMatch = webPage.url.match(/(https?:\/\/)(www.)?([^\/]*)(\/){0,1}(.*)/);
                if(domainMatch[3] && !uniqueDomains.some(domain => domain === domainMatch[3])) uniqueDomains.push(domainMatch[3]);
            }
        })
    } 
    return uniqueDomains;
}