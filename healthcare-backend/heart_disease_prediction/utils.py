import joblib
import pandas as pd
import os

# Load model và encoder một lần
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, 'ml/heart_model.pkl'))
label_encoders = joblib.load(os.path.join(BASE_DIR, 'ml/label_encoders.pkl'))

def predict_heart(data_dict):
    df = pd.DataFrame([data_dict])

    for col in df.select_dtypes(include='object').columns:
        le = label_encoders[col]
        df[col] = le.transform(df[col])

    prediction = model.predict(df)[0]
    proba = model.predict_proba(df)[0][1] * 100  # % bị bệnh

    return {
        'result': int(prediction),
        'probability': round(proba, 2)
    }
