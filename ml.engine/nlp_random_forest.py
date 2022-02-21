# import libraries
# sklearn reference: https://scikit-learn.org/0.19/about.html#citing-scikit-learn
# pandas reference: https://pandas.pydata.org/
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
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
    clf = RandomForestClassifier()

    # use the term-frequency inverse document frequency vectorizer to transform count of text
    # into a weighed matrix of term importance
    vec_tdidf = TfidfVectorizer(ngram_range=(1,2), analyzer='word', norm='l2')

    # compile both the TextTransformer and TfidfVectorizer 
    # to the text features

    body = Pipeline([
                    ('transformer', TextTransformer(key='body')),
                    ('vectorizer', vec_tdidf)
                    ])

    # combine all of the features, text and numeric together
    features = FeatureUnion([('body', body)
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
