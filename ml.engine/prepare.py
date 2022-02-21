import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from tensorflow.keras.preprocessing.sequence import pad_sequences as keras_pad_sequences
from tensorflow.keras.preprocessing.text import one_hot
import numpy as np
from sklearn.preprocessing import MinMaxScaler

SENTENCE_LENGTH = 1000
VOCABULARY_SIZE = 100000
PADDING_TYPE = 'pre'

def clean_text(text):
    clean_text_split = re.sub('[^a-zA-Z]', ' ', text).lower().split()
    # stem words in text that are not stop words
    clean_text_split = [PorterStemmer().stem(word) for word in clean_text_split if not word in stopwords.words('english')]
    return ' '.join(clean_text_split)

def one_hot_representation(text):
    return one_hot(text, VOCABULARY_SIZE)

def process_text(text):
    cleaned_text = clean_text(text)
    text_one_hot_representation = one_hot_representation(cleaned_text)
    return text_one_hot_representation

def pad_sequences(sequences, max_sentence_length = SENTENCE_LENGTH):
    return keras_pad_sequences(sequences, padding=PADDING_TYPE, maxlen=max_sentence_length)

def process_texts(texts, max_sentence_length = SENTENCE_LENGTH):
    processed_texts = []
    processed_texts_count = 0
    for text in texts:
        processed_texts.append(process_text(text))
        processed_texts_count += 1
        print("Processed Texts Count: ", processed_texts_count)
    padded_processed_texts = pad_sequences(processed_texts, max_sentence_length)
    return padded_processed_texts

def process_multiple_texts(texts_a, texts_b):
    joined_texts = []
    for i in range(len(texts_a)):
        joined_texts.append(texts_a[i] + " " + texts_b[i])
    return process_texts(joined_texts)

def merge_arrays(two_dim_array):
    mergeable: bool = False
    if len(two_dim_array) > 1:
        mergeable = True
        single_array_length = len(two_dim_array[0])
        for single_array in two_dim_array:
            if len(single_array) != single_array_length:
                mergeable = False
                break
        
        if  mergeable:
            merged_array = []
            for i in range(single_array_length):
                merged_row = []
                for single_array in two_dim_array:
                    merged_row.append(single_array[i])
                merged_array.append(merged_row)
            # print("Merged Array Shape: ", np.array(merged_array).shape)
            return merged_array
        else:
            return []

def scale_data(data):
    scaler = MinMaxScaler(feature_range=(0, 1))
    return scaler.fit_transform(data)