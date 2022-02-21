import express from "express";
import cors from 'cors';
import { registerRoutes } from "./routing";
import { listenForMentions, replyToTweet, fetchTweet, classifyArticle, tweetResponseAsArticle } from "./services";
import { Twitter } from 'twit';
import Status = Twitter.Status;


const onMention = async (tweet: Status) => {
    console.log("Mentionedddd ", tweet.text, tweet.id_str);
    const originalTweetId = tweet.in_reply_to_status_id_str;
    if (originalTweetId) {
        const fetchOriginalTweetResponse = await fetchTweet(originalTweetId);
        console.log("Original Tweeet", fetchOriginalTweetResponse.data.text, fetchOriginalTweetResponse.data.id_str);
        const classificationResponse = await classifyArticle(tweetResponseAsArticle(fetchOriginalTweetResponse));
        if(classificationResponse){
            console.log("Tweet Classification response: ", classificationResponse);
            const classificationUrl = `http://localhost:3000/results/${classificationResponse._id!}`
            replyToTweet(tweet.id_str, `@${tweet.user.screen_name} your classification result is ready at ${classificationUrl}`);
        }
    }
}


const username = "PoliceOfParody";
listenForMentions(username, onMention);
console.log("Listening for mentions of: ", `@${username}`);

const app = express();
app.use(cors());
app.use(express.json());
registerRoutes(app);

const port = process.env.PORT || 6000;
app.listen(port);

console.log("Express Application Running at: ", port);