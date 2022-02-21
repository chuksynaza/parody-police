import { Express } from "express";
import { getTweet } from "./controllers"

export const registerRoutes = (app: Express) => {
    app.get('/home', (request, response) => {
        response.send('GET request to the homepage')
    });

    app.get('/tweets/:tweetId', getTweet);
}