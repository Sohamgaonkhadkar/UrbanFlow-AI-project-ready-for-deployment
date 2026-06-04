# UrbanFlow AI: Full-Stack Spatiotemporal Forecasting Engine

## 1. Executive Summary

UrbanFlow AI is an end-to-end, full-stack spatiotemporal forecasting platform designed for real-time urban mobility demand prediction. Powered by a production-grade LightGBM forecasting engine trained on over **33 million NYC taxi trip records**, the platform combines advanced machine learning, dynamic feature engineering, live weather integration, and scalable cloud deployment to deliver high-resolution demand forecasts across New York City.

The system features a production-ready **FastAPI** backend, a responsive **React/Vite** telemetry dashboard, and a recursive forecasting pipeline capable of generating multi-step demand predictions while preserving temporal dependencies.

> Built and deployed a full-stack spatiotemporal forecasting platform serving real-time taxi demand predictions across **30 NYC spatial clusters**, trained on **33M+ trip records** and achieving **90.59% forecasting accuracy (WAPE-based)** on unseen test data.

## Key Features

* Trained on **33+ million NYC taxi trip records**
* Recursive multi-step demand forecasting
* Real-time weather-aware inference using Open-Meteo
* 30-cluster spatial demand modeling
* Dynamic feature engineering with lag and rolling statistics
* Production-ready FastAPI backend
* Interactive React-based telemetry dashboard
* Spatial demand heatmap visualization
* KPI monitoring and operational analytics
* Feature importance and model explainability tools
* Dockerized cloud deployment on Oracle Cloud Infrastructure (OCI)
* End-to-end full-stack machine learning system


---

## 2. Live Deployment & System Status

* **Live Application:** [UrbanFlow AI Dashboard](http://140.238.240.219/index.html)
* **Backend API:** `http://140.238.240.219:8000`

### 2.1 Operational Constraints & Infrastructure Notes
* **Oracle Cloud Infrastructure (OCI):** This platform is currently deployed on Oracle Cloud. Due to limited cloud credits and resource allocation, the server instance may enter hibernation or experience downtime in the future. 
* **API Forecasting Limit:** The system utilizes the Open-Meteo API for real-time meteorological feature engineering. Consequently, the live web application will only generate valid predictions for the **current date and up to 14 days into the future**. Selecting dates beyond this horizon will result in weather data fetch failures.

### 2.2 System Visuals
*(Note:The public demo may occasionally be unavailable due to infrastructure maintenance., please refer to the media below for system functionality.)*

### Dashboard Preview

![UrbanFlow AI Dashboard](https://github.com/user-attachments/assets/67534e54-2d07-40ba-8c0a-9bb611bf05f5)

*The UrbanFlow AI primary telemetry dashboard illustrating real-time inference, spatial density, and system KPIs.*

### System Demonstration

https://github.com/user-attachments/assets/6c0cd1eb-78aa-4e55-aa77-2dc26a57d7ca

*Live demonstration of UrbanFlow AI's recursive forecasting engine, telemetry dashboard, KPI monitoring system, and spatial demand visualization.*

---

## 3. Full-Stack System Architecture

The architecture is strictly decoupled, separating the heavy machine learning inference workloads from the client-side rendering engine.

```text
[ Client Browser (React + Vite) ]
          │
          ▼ (REST API / JSON)
[ FastAPI Asynchronous Server ]
          │
          ├──────────────────────────────┐
          ▼                              ▼
[ Feature Engineering ]        [ External Weather API ]
(Lags, Rolling Means)             (Open-Meteo)
          │                              │
          └──────────────┬───────────────┘
                         ▼
           [ LightGBM Inference Engine ]
             (Recursive Prediction Loop)
```
## 4. Intelligence Layer (Backend)

The backend is built with **FastAPI** and serves a production-ready LightGBM forecasting engine through asynchronous REST APIs. On startup, the application loads the serialized model and historical demand matrix into memory to minimize inference latency.

### Core Capabilities

* Recursive multi-step demand forecasting
* Real-time weather-aware predictions via Open-Meteo
* Dynamic reconstruction of 76 engineered features
* High-performance asynchronous request handling
* Memory-optimized inference pipeline

### Recursive Forecasting Strategy

Unlike standard single-step forecasting systems, UrbanFlow AI performs recursive forecasting. Each predicted demand value is fed back into the historical feature matrix and reused as a lag feature for the subsequent prediction step. This enables forecasting across flexible horizons while preserving temporal dependencies.

### Dynamic Feature Engineering

The backend reconstructs the same feature space used during training, including:

* Temporal cyclical features (`hour_sin`, `hour_cos`)
* Lag-based demand indicators
* Rolling statistical features
* Weather-derived variables
* LightGBM-compatible categorical encodings

---

## 5. Telemetry Dashboard (Frontend)

The frontend is developed using **React**, **Vite**, **Tailwind CSS**, **Recharts**, and **Framer Motion** to provide a responsive real-time operational dashboard.

### Dashboard Modules

* **Forecast Visualization:** Interactive demand trajectory displaying historical observations and future projections.
* **KPI Monitoring:** Immediate operational metrics including demand forecasts, weather conditions, and active region selection.
* **Spatial Heatmap:** Regional demand intensity visualization across 30 spatial clusters.
* **Feature Importance:** Model transparency module highlighting key prediction drivers.
* **Weather Integration:** Real-time meteorological context used during forecasting.

The dashboard transforms machine learning outputs into actionable operational intelligence through interactive visual analytics.

---

## 6. Infrastructure & Deployment

UrbanFlow AI is containerized and deployed on **Oracle Cloud Infrastructure (OCI)**.

### Technology Stack

| Layer                 | Technology                |
| --------------------- | ------------------------- |
| Frontend              | React, Vite, Tailwind CSS |
| Backend               | FastAPI                   |
| ML Engine             | LightGBM                  |
| Visualization         | Recharts                  |
| Animation             | Framer Motion             |
| Weather Data          | Open-Meteo API            |
| Deployment            | Docker, OCI               |
| Dependency Management | Nixpacks                  |

### Deployment Features

* Dockerized application architecture
* OCI cloud deployment
* Nixpacks-based dependency management
* OpenMP support for LightGBM execution
* Secure CORS configuration
* Environment-based configuration management


---
## 7. Model Performance Analytics

The final production-grade **LightGBM forecasting pipeline**, tracked and versioned using **MLflow**, was evaluated on temporally separated unseen test data to simulate real-world forecasting conditions.

### Performance Metrics

| Metric                                        | Score      | Operational Interpretation                                                                                 |
| --------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| **MAE (Mean Absolute Error)**                 | **12.41**  | Average forecasting deviation remains limited to approximately 12 vehicle allocations per spatial cluster. |
| **RMSE (Root Mean Square Error)**             | **20.04**  | Demonstrates strong robustness against demand surges and extreme variance scenarios.                       |
| **R² Score**                                  | **0.9764** | The feature engineering pipeline explains **97.64%** of observed urban mobility demand variance.           |
| **WAPE (Weighted Absolute Percentage Error)** | **9.41%**  | Equivalent to an overall forecasting accuracy of approximately **90.59%** across the evaluation horizon.   |

## Research & Training Pipeline

The complete exploratory analysis, feature engineering workflow, model experimentation process, and MLflow training pipeline are available in the companion repository:

**Training Repository:**
https://github.com/Sohamgaonkhadkar/UBER-DEMAND-PREDICTION

This production deployment repository focuses on model serving, recursive forecasting, API infrastructure, and full-stack application deployment.

---

## 8. Local Development Setup

To run this platform locally for further development:

### 1. Clone the Repository

```bash
git clone https://github.com/Sohamgaonkhadkar/UrbanFlow-AI-project-ready-for-deployment.git
cd UrbanFlow-AI-project-ready-for-deployment
```

### 2. Initialize the Backend (FastAPI)

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Initialize the Frontend (Vite)

```bash
# Open a new terminal instance
npm install
npm run dev
```

---
## Project Structure

UrbanFlow-AI/
│
├── backend/
│   ├── main.py                    # FastAPI entrypoint
│   ├── forecasting_service.py     # Recursive forecasting engine
│   ├── feature_engineering.py     # Feature generation pipeline
│   ├── weather_service.py         # Open-Meteo integration
│   ├── data/
│   └── services/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForecastChart.jsx
│   │   │   ├── DemandHeatmap.jsx
│   │   │   ├── KPISection.jsx
│   │   │   └── FeatureImportance.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   └── index.html
│
├── Dockerfile
├── requirements.txt
├── nixpacks.toml
└── README.md

## Author

Engineered and developed by **Soham Mahesh Gaonkhadkar**, Department of Chemical Engineering, *Indian Institute of Technology Kharagpur*.

