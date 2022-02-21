# import libraries
# sklearn reference: https://scikit-learn.org/0.19/about.html#citing-scikit-learn
# pandas reference: https://pandas.pydata.org/
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline, FeatureUnion


# text and numeric classes that use sklearn base libaries
class TextTransformer(BaseEstimator, TransformerMixin):
    """
    Transform text features
    """
    def __init__(self, key):
        self.key = key

    def fit(self, X, y=None, *parg, **kwarg):
        return self

    def transform(self, X):
        return X[self.key]
    
class NumberTransformer(BaseEstimator, TransformerMixin):
    """
    Transform numeric features
    """
    def __init__(self, key):
        self.key = key

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X[[self.key]]


def create_model():
    
    print("Creating Model ------------ ")
    # create the classfier from RF
    clf = GradientBoostingClassifier()

    # use the term-frequency inverse document frequency vectorizer to transform count of text
    # into a weighed matrix of term importance
    vec_tdidf = TfidfVectorizer(ngram_range=(1,2), analyzer='word', norm='l2')

    # compile both the TextTransformer and TfidfVectorizer 
    # to the text features

    body = Pipeline([
                ('transformer', TextTransformer(key='body')),
                ('vectorizer', vec_tdidf)
                ])

    search_estimated_matches = Pipeline([
                    ('transformer', NumberTransformer(key='searchEstimatedMatches')),
                    ])

    search_unique_domain_count = Pipeline([
                    ('transformer', NumberTransformer(key='searchUniqueDomainCount')),
                    ])
                
    title_sentiment_category = Pipeline([
                    ('transformer', NumberTransformer(key='titleSentimentCategory')),
                    ])

    title_sentiment_positive_score = Pipeline([
                    ('transformer', NumberTransformer(key='titleSentimentPositiveScore')),
                    ])
    title_sentiment_negative_score = Pipeline([
                    ('transformer', NumberTransformer(key='titleSentimentNegativeScore')),
                    ])

    title_sentiment_neutral_score = Pipeline([
                    ('transformer', NumberTransformer(key='titleSentimentNeutralScore')),
                    ])

    body_sentiment_category = Pipeline([
                    ('transformer', NumberTransformer(key='bodySentimentCategory')),
                    ])

    body_sentiment_positive_score = Pipeline([
                    ('transformer', NumberTransformer(key='bodySentimentPositiveScore')),
                    ])
    body_sentiment_negative_score = Pipeline([
                    ('transformer', NumberTransformer(key='bodySentimentNegativeScore')),
                    ])

    body_sentiment_neutral_score = Pipeline([
                    ('transformer', NumberTransformer(key='bodySentimentNeutralScore')),
                    ])

    # combine all of the features, text and numeric together
    features = FeatureUnion([('body', body),
                        ('searchEstimatedMatches', search_estimated_matches),
                        ('searchUniqueDomainCount', search_unique_domain_count),
                        ('titleSentimentCategory', title_sentiment_category),
                        ('titleSentimentPositiveScore', title_sentiment_positive_score),
                        ('titleSentimentNegativeScore', title_sentiment_negative_score),
                        ('titleSentimentNeutralScore', title_sentiment_neutral_score),
                        ('bodySentimentCategory', body_sentiment_category),
                        ('bodySentimentPositiveScore', body_sentiment_positive_score),
                        ('bodySentimentNegativeScore', body_sentiment_negative_score),
                        ('bodySentimentNeutralScore', body_sentiment_neutral_score)
                        ])


    # unite the features and classfier together
    pipe = Pipeline([('features', features),
                    ('clf', clf)
                    ])

    # parameter grid to scan through
    param_grid = {
        'clf__n_estimators': [10, 20, 30, 40, 50, 100]
    }

    grid_search = GridSearchCV(estimator = pipe, param_grid = param_grid, 
                            cv = 2, n_jobs = 6, verbose = 1, return_train_score=True)

    print("Completerd Creating Model ------------ ")
    return grid_search
