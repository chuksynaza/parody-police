# Parody Police

A fake news detection tool built with an ensemble of ML classifiers (Tensorflow Keras, Sckit Learn) classifying articles based on features extracted from  Microsoft Azure's Sentiment Analysis/Cognitive Services API and many more including, web search results etc.

Contains four subprojects
 - web.portal: The React/TypeScript SPA serving the web application for classification of news articles. Articles can be classified by pasting plain text or URLs to supported websites/Twitter where they are scraped off
 - web.api: Node/Express/TypeScript/MongoDB application serving the APIs
 - twitter.engine: The Twitter bot/twitter API connector service, to respond to tweets where the bot @someUsername is mentioned with the classification results and also helps with scraping tweets for classification
 - ml.engine: Flask/Python app loading the already trained ML models (`./ml.engine/models`) into an ensemble for classification. All ML models are currently gitignored :-P


At this point I'd normally wish the readers a happy dev experience. But, I'm also aware this readme might not be sufficient