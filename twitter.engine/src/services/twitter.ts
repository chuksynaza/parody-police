import Twit, { Twitter } from 'twit';
import { ClassificationRequest } from './classify';
import Status = Twitter.Status;
// TODO: Inject from config, env variable
const twitClient = new Twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: ''
})

interface TweetResponse {
    data: Status;
}

export const fetchTweet = (id: string): Promise<TweetResponse> => {
    return twitClient.get('statuses/show/:id', {
        id
    }) as Promise<TweetResponse>
}

export const listenForMentions = async (username: string, handleMention: (tweet: Status) => void) => {
    const listenStream = twitClient.stream('statuses/filter', {
        track: [`@${username}`]
    });
    return new Promise((resolve, reject) => {
        listenStream.on('tweet', (tweet) => handleMention(tweet));
        resolve();
    });
}

export const replyToTweet = (id: string, reply: string) => {
    return twitClient.post('statuses/update', {
        status: reply,
        in_reply_to_status_id: id
    })
}

export const tweetResponseAsArticle = (tweetResponse: TweetResponse): ClassificationRequest => ({
    title: tweetResponse.data.text.split(' ').slice(0, 10).join(' '),
    body: tweetResponse.data.text
});