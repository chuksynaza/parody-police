import * as cheerio from "cheerio";
import { ClassificationRequest, ScrapeResult } from '../models';

const scrapeArticle = async (url: string) => {
    try {
        const fetchSiteResponse = await fetch(url);
        if(!fetchSiteResponse.ok) return null;
        const siteContents = await fetchSiteResponse.text();
        console.log("Site COntents", siteContents.substr(0, 30));
        const $ = cheerio.load(siteContents);
        console.log("Title", $("title").text())
        return $;
    } catch (error) {
        console.error(`Error scraping article ${error}`);
        return null;
    }
}

const scrapeTweet = async (tweetId: string): Promise<ClassificationRequest | null> => {
    try {
        const fetchScrapeTweetResponse = await fetch(`http://127.0.0.1:6000/tweets/${tweetId}`);
        if(!fetchScrapeTweetResponse.ok) return null;
        return await fetchScrapeTweetResponse.json();
    } catch(error){
        return null;
    }
}

enum Handler {
    SEVEN_NEWS_AU = '7news.com.au',
    ABC_AU = 'abc.net.au',
    TWITTER = 'twitter.com',
    BETOOTA_ADVOCATE = 'betootaadvocate.com',
    NATIONAL_GEOGRAPHIC = 'nationalgeographic.com'
}

type ScrapeHandlers = {
    [handlerKey in Handler]: (url: string) => Promise<ScrapeResult | null>;
};

export const scrapeHandlers: ScrapeHandlers = {
    [Handler.SEVEN_NEWS_AU] : async (url: string) =>  {
        const $ = await scrapeArticle(url);
        if($) {
            return {
                title: $("title").text(),
                body: $("#ArticleContent").text()
            }
        }
        return null;
    },
    [Handler.ABC_AU] : async (url: string) =>  {
        const $ = await scrapeArticle(url);
        if($) {
            return {
                title: $("title").text(),
                body: $("#body").text()
            }
        }
        return null;
    },
    [Handler.TWITTER] : async (url: string) =>  {
        const tweetMatch = url.match(/^.*\/status\/([0-9]+)/);
        if(tweetMatch && tweetMatch[1]) {
            console.log("Scraping tweet with id: ", tweetMatch[1]);
            return await scrapeTweet(tweetMatch[1]);
        }
        console.log("No status id");
        return null;
    },
    [Handler.BETOOTA_ADVOCATE] : async (url: string) =>  {
        const $ = await scrapeArticle(url);
        if($) {
            return {
                title: $("title").text(),
                body: $(".td-post-content").text()
            }
        }
        return null;
    },
    [Handler.NATIONAL_GEOGRAPHIC] : async (url: string) =>  {
        const $ = await scrapeArticle(url);
        if($) {
            return {
                title: $(".main-title").text(),
                body: $("#article__body").text()
            }
        }
        return null;
    }
}
