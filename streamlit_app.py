import streamlit as st
import joblib
import numpy as np

model = joblib.load("models/flood_model.pkl")

st.title("Flood Risk Prediction System")

st.write("Enter environmental parameters")

# Inputs
latitude = st.number_input("Latitude")
longitude = st.number_input("Longitude")
rainfall = st.number_input("Rainfall (mm)")
temperature = st.number_input("Temperature (°C)")
humidity = st.number_input("Humidity (%)")
river_discharge = st.number_input("River Discharge (m³/s)")
water_level = st.number_input("Water Level (m)")
elevation = st.number_input("Elevation (m)")

land_cover = st.number_input("Land Cover (encoded number)")
soil_type = st.number_input("Soil Type (encoded number)")

population_density = st.number_input("Population Density")
infrastructure = st.number_input("Infrastructure")
historical_floods = st.number_input("Historical Floods")

if st.button("Predict Flood Risk"):

    features = np.array([[latitude, longitude, rainfall, temperature,
                          humidity, river_discharge, water_level,
                          elevation, land_cover, soil_type,
                          population_density, infrastructure,
                          historical_floods]])

    prediction = model.predict(features)

    if prediction[0] == 1:
        st.error("High Flood Risk")
    else:
        st.success("Low Flood Risk")