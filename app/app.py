from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

model_path = os.path.join(os.path.dirname(__file__), "../models/flood_model.pkl")

model = joblib.load(model_path)

@app.route("/")
def home():
    return "Flood Risk Prediction API"

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    features = np.array(list(data.values())).reshape(1,-1)

    prediction = model.predict(features)

    return jsonify({"Flood Risk": int(prediction[0])})

if __name__ == "__main__":
    app.run(debug=True)