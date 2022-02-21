from flask import Flask, request
from flask_api import status
from models import Trained_Models, features_from_request, predict_with_model, nlp_lstm, nlp_meta_lstm, nlp_random_forest, nlp_meta_random_forest, nlp_gradient_boosting, nlp_meta_gradient_boosting
from prepare import process_texts, process_multiple_texts, merge_arrays
import numpy as np
app = Flask(__name__)

def is_valid_predict_request(request_data):
    return True

def run_prediction(request_data):
    if is_valid_predict_request(request_data):

        # # Get Prediction Data
        # article_titles = [request_data['title']]
        # article_bodies = [request_data['body']]
        # article_search_estimated_matches = [request_data['searchEstimatedMatches']]
        # article_search_unique_domain_counts = [request_data['searchUniqueDomainCount']]
        # article_title_sentiment_categories = [request_data['titleSentimentCategory']]
        # article_title_sentiment_positive_scores = [request_data['titleSentimentPositiveScore']]
        # article_title_sentiment_negative_scores = [request_data['titleSentimentNegativeScore']]
        # article_title_sentiment_neutral_scores = [request_data['titleSentimentNeutralScore']]
        # article_body_sentiment_categories = [request_data['bodySentimentCategory']]
        # article_body_sentiment_positive_scores = [request_data['bodySentimentPositiveScore']]
        # article_body_sentiment_negative_scores = [request_data['bodySentimentNegativeScore']]
        # article_body_sentiment_neutral_scores = [request_data['bodySentimentNeutralScore']]
        # processed_article_titles = process_texts(article_titles, 50)
        # processed_article_bodies = process_texts(article_bodies)
        # processed_article_titles_bodies = process_multiple_texts(article_titles, article_bodies)

        # # Model A: multi_input_meta_nlp_sentiment_search_lstm_with_dropout_prediction_result prediction
        # model_a_prediction_meta_input_data = np.array(merge_arrays([
        #     article_search_estimated_matches,
        #     article_search_unique_domain_counts,
        #     article_title_sentiment_categories,
        #     article_title_sentiment_positive_scores,
        #     article_title_sentiment_negative_scores,
        #     article_title_sentiment_neutral_scores,
        #     article_body_sentiment_categories,
        #     article_body_sentiment_positive_scores,
        #     article_body_sentiment_negative_scores,
        #     article_body_sentiment_neutral_scores,
        # ]))

        # model_a_prediction_nlp_input_data = np.array(list(processed_article_titles_bodies))
        # model_a_prediction_result = multi_input_meta_nlp_sentiment_search_lstm_with_dropout.predict({META_INPUT: model_a_prediction_meta_input_data, NLP_INPUT: model_a_prediction_nlp_input_data}, batch_size=10, verbose=0)

        # model_b_prediction_input_data = np.array(list(processed_article_titles_bodies))
        # model_b_prediction_result = sequential_lstm_with_dropout.predict(model_b_prediction_input_data, batch_size=10, verbose=0)
        # print(Trained_Models.TRAINED_MULTI_INPUT_META_NLP_SENTIMENT_SEARCH_LSTM_WITH_DROPOUT.value + " prediction: ", model_a_prediction_result[0].tolist()[0])
        # print(Trained_Models.TRAINED_SEQUENTIAL_LSTM_WITH_DROPOUT.value + " prediction: ", model_b_prediction_result[0].tolist()[0])

        model_inputs = features_from_request(request_data)

        return {
            Trained_Models.TRAINED_NLP_LSTM.value: predict_with_model(nlp_lstm, model_inputs),
            Trained_Models.TRAINED_NLP_META_LSTM.value: predict_with_model(nlp_meta_lstm, model_inputs, True),
            Trained_Models.TRAINED_NLP_RANDOM_FOREST.value: predict_with_model(nlp_random_forest, model_inputs, False, 'sckit'),
            Trained_Models.TRAINED_NLP_META_RANDOM_FOREST.value: predict_with_model(nlp_meta_random_forest, model_inputs, True, 'sckit'),
            Trained_Models.TRAINED_NLP_GRADIENT_BOOSTING.value: predict_with_model(nlp_gradient_boosting, model_inputs, False, 'sckit'),
            Trained_Models.TRAINED_NLP_META_GRADIENT_BOOSTING.value: predict_with_model(nlp_meta_gradient_boosting, model_inputs, True, 'sckit')
        }

@app.route('/predict', methods=['POST'])
def predict():
    if(request.is_json):
        request_data = request.get_json()
        # print("Request Data: ", request_data)
        prediction_result = run_prediction(request_data)
        print("Prediction Result: ", prediction_result)
        return prediction_result
    return {}, status.HTTP_400_BAD_REQUEST