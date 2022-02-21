from tensorflow.keras.models import load_model
from joblib import load
from enum import Enum
import numpy as np
from prepare import process_texts, process_multiple_texts, merge_arrays, scale_data
import pandas as pd

NLP_INPUT = 'NLP_INPUT'
META_INPUT = 'META_INPUT'
PREDICTION_TRUE_LOWER_BOUND = 0.5

class Trained_Models(Enum):
    TRAINED_NLP_LSTM = 'TRAINED_NLP_LSTM'
    TRAINED_NLP_META_LSTM = 'TRAINED_NLP_META_LSTM'
    TRAINED_NLP_RANDOM_FOREST = 'TRAINED_NLP_RANDOM_FOREST'
    TRAINED_NLP_META_RANDOM_FOREST = 'TRAINED_NLP_META_RANDOM_FOREST'
    TRAINED_NLP_GRADIENT_BOOSTING = 'TRAINED_NLP_GRADIENT_BOOSTING'
    TRAINED_NLP_META_GRADIENT_BOOSTING = 'TRAINED_NLP_META_GRADIENT_BOOSTING'

def load_saved_model(name, type="keras"):
    if type == "keras":
        path = "models/" + name + ".h5"
        print("Loading model: ", name, " from path: ", path)
        return load_model(path)
    else:
        path = "models/" + name + ".joblib"
        print("Loading model: ", name, " from path: ", path)
        return load(path)

def boolean_prediction(prediction_score):
    if prediction_score >= PREDICTION_TRUE_LOWER_BOUND:
        return 1
    else:
        return 0

def features_from_request(request_data):
    article_titles = request_data['title']
    article_bodies = request_data['body']
    article_search_estimated_matches = request_data['searchEstimatedMatches']
    article_search_unique_domain_counts = request_data['searchUniqueDomainCount']
    article_title_sentiment_categories = request_data['titleSentimentCategory']
    article_title_sentiment_positive_scores = request_data['titleSentimentPositiveScore']
    article_title_sentiment_negative_scores = request_data['titleSentimentNegativeScore']
    article_title_sentiment_neutral_scores = request_data['titleSentimentNeutralScore']
    article_body_sentiment_categories = request_data['bodySentimentCategory']
    article_body_sentiment_positive_scores = request_data['bodySentimentPositiveScore']
    article_body_sentiment_negative_scores = request_data['bodySentimentNegativeScore']
    article_body_sentiment_neutral_scores = request_data['bodySentimentNeutralScore']
    processed_article_titles = process_texts([article_titles], 50)
    processed_article_bodies = process_texts([article_bodies])
    processed_article_titles_bodies = process_multiple_texts([article_titles], [article_bodies])

    unscaled_lstm_meta_input_data = np.array(merge_arrays([
        [article_search_estimated_matches],
        [article_search_unique_domain_counts],
        [article_title_sentiment_categories],
        [article_title_sentiment_positive_scores],
        [article_title_sentiment_negative_scores],
        [article_title_sentiment_neutral_scores],
        [article_body_sentiment_categories],
        [article_body_sentiment_positive_scores],
        [article_body_sentiment_negative_scores],
        [article_body_sentiment_neutral_scores],
    ]))

    # lstm_meta_input_data = scale_data(unscaled_meta_input_data)
    # scale_play = scale_data(unscaled_meta_input_data.reshape(10, -1))
    reshaped_scaled_lstm_meta_input_data = scale_data(unscaled_lstm_meta_input_data.reshape(10, -1))
    lstm_meta_input_data = reshaped_scaled_lstm_meta_input_data.reshape(-1, 10)
    # print("unscaled_meta_input_data", unscaled_lstm_meta_input_data)
    # print("scaled_meta_input_data", lstm_meta_input_data)

    lstm_nlp_input_data = np.array(list(processed_article_titles_bodies))

    mixed_input_features = [
        'body',
        'searchEstimatedMatches', 
        'searchUniqueDomainCount', 
        'titleSentimentCategory', 
        'titleSentimentPositiveScore', 
        'titleSentimentNegativeScore',
        'titleSentimentNeutralScore',
        'bodySentimentCategory',
        'bodySentimentPositiveScore',
        'bodySentimentNegativeScore',
        'bodySentimentNeutralScore'
    ]

    nlp_input_features = ['body']

    sckit_request_data = pd.DataFrame(request_data, index=[0])

    sckit_nlp_meta_input_data = sckit_request_data[mixed_input_features]

    sckit_nlp_input_data = sckit_request_data[nlp_input_features]

    return lstm_meta_input_data, lstm_nlp_input_data, sckit_nlp_meta_input_data, sckit_nlp_input_data

def predict_with_model(model, model_inputs, extra_features = False, model_type = 'lstm'):
    lstm_meta_input_data, lstm_nlp_input_data, sckit_nlp_meta_input_data, sckit_nlp_input_data = model_inputs

    if model_type == 'lstm':
        if extra_features:
            # print("Pred inp meta: lstm ", lstm_meta_input_data, lstm_meta_input_data.shape)
            # print("Pred inp nlp: lstm ", lstm_nlp_input_data, lstm_nlp_input_data.shape)
            prediction_result = model.predict({META_INPUT: lstm_meta_input_data, NLP_INPUT: lstm_nlp_input_data}, batch_size=10, verbose=0)
            print("PReD result: lstm extra ", prediction_result, prediction_result.shape,prediction_result[0])
            return boolean_prediction(prediction_result[0])
        else:
            prediction_result = model.predict(lstm_nlp_input_data, batch_size=10, verbose=0)
            print("PReD result: lstm", prediction_result, prediction_result.shape, prediction_result[0])
            return boolean_prediction(prediction_result[0])
    else:
        if extra_features:
            # print("Pred inp meta: sckit ", sckit_nlp_meta_input_data)
            prediction_result = model.predict(sckit_nlp_meta_input_data)
            print("PReD result: sckit extra", prediction_result, prediction_result.shape, prediction_result[0])
            return boolean_prediction(prediction_result[0])
        else:
            prediction_result = model.predict(sckit_nlp_input_data)
            print("PReD result:sckit ", prediction_result, prediction_result.shape, prediction_result[0])
            return boolean_prediction(prediction_result[0])

nlp_lstm = load_saved_model(Trained_Models.TRAINED_NLP_LSTM.value)
nlp_meta_lstm = load_saved_model(Trained_Models.TRAINED_NLP_META_LSTM.value)

print("------------------------------- LSTM NLP Summarry")
print(nlp_lstm.summary())
print("------------------------------- End LSTM NLP Summarry")

print("------------------------------- LSTM META_NLP Summarry")
print(nlp_meta_lstm.summary())
print("------------------------------- End LSTM META_NLP Summarry")

nlp_random_forest = load_saved_model(Trained_Models.TRAINED_NLP_RANDOM_FOREST.value, 'sckit')
nlp_meta_random_forest = load_saved_model(Trained_Models.TRAINED_NLP_META_RANDOM_FOREST.value, 'sckit')
nlp_gradient_boosting = load_saved_model(Trained_Models.TRAINED_NLP_GRADIENT_BOOSTING.value, 'sckit')
nlp_meta_gradient_boosting = load_saved_model(Trained_Models.TRAINED_NLP_META_GRADIENT_BOOSTING.value, 'sckit')

