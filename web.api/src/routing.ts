import { Express } from "express";
import { scrapeArticleOffWebsite, classifyArticle, getClassification } from "./controllers"

export const registerRoutes = (app: Express) => {
    app.get('/home', (request, response) => {
        response.send('GET request to the homepage')
    });

    app.get('/scrape', scrapeArticleOffWebsite);
    app.post('/classifications', classifyArticle);
    app.get('/classifications/:classificationId', getClassification);
}