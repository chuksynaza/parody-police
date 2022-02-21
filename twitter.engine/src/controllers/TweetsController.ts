import { Request, Response } from "express";
import { ClassificationRequest } from "services/classify";
import { fetchTweet, tweetResponseAsArticle } from "../services";

export const getTweet = async (request: Request, response: Response) => {
    const tweetId = request.params.tweetId.toString();
    if(tweetId.length > 3){
        const fetchTweetResponse = await fetchTweet(tweetId);
        const tweetAsArticle = tweetResponseAsArticle(fetchTweetResponse);
        console.log("Tweet as Article: ", tweetAsArticle);
        response.json(tweetAsArticle);
        return;
    }
    response.status(400).json({ error: 'Unsupported URL' });
}