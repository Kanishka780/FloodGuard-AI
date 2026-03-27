import sys
import os
import joblib
import warnings

warnings.filterwarnings("ignore")

# Load model
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(model_path)

# Get input from command line
rainfall = float(sys.argv[1])
elevation = float(sys.argv[2])
drainage = float(sys.argv[3])
waterlogging = float(sys.argv[4])

# Predict
prediction = model.predict([[rainfall, elevation, drainage, waterlogging]])

print(prediction[0])
