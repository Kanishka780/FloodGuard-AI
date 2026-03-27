import sys
import os
import joblib
import warnings

warnings.filterwarnings("ignore")

# Load model
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(model_path)

# Inputs
rainfall = float(sys.argv[1])
elevation = float(sys.argv[2])
drainage = float(sys.argv[3])
waterlogging = float(sys.argv[4])

# Prediction
prediction = model.predict([[rainfall, elevation, drainage, waterlogging]])[0]
probs = model.predict_proba([[rainfall, elevation, drainage, waterlogging]])[0]

confidence = max(probs)

# 🔥 RULE-BASED CORRECTION (IMPORTANT)

if rainfall < 5:
    prediction = "LOW"
    confidence = 0.9
elif rainfall < 10:
    if elevation < 4 or drainage < 5:
        prediction = "MEDIUM"
    else:
        prediction = "LOW"
elif rainfall > 20:
    prediction = "HIGH"

# Output BOTH
print(f"{prediction},{confidence:.2f}")
