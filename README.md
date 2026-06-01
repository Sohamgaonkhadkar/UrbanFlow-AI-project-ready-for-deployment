# UrbanFlow AI: Full-Stack Spatiotemporal Forecasting Engine

## 1. Executive Summary
UrbanFlow AI is an end-to-end, full-stack machine learning platform designed for real-time urban mobility forecasting. Building upon a highly optimized LightGBM inference engine trained on 33 million NYC transit records, the system deploys a scalable **FastAPI** backend and a reactive **React/Vite** telemetry dashboard. 

The platform supports live recursive time-series forecasting, dynamic feature engineering, and live weather integrations to project high-resolution taxi demand across 30 spatial clusters in New York City.

---

## 2. Live Deployment & System Status

* **Live Application:** [UrbanFlow AI Dashboard](http://140.238.240.219/index.html)
* **Backend API:** `http://140.238.240.219:8000`

### 2.1 Operational Constraints & Infrastructure Notes
* **Oracle Cloud Infrastructure (OCI):** This platform is currently deployed on Oracle Cloud. Due to limited cloud credits and resource allocation, the server instance may enter hibernation or experience downtime in the future. 
* **API Forecasting Limit:** The system utilizes the Open-Meteo API for real-time meteorological feature engineering. Consequently, the live web application will only generate valid predictions for the **current date and up to 14 days into the future**. Selecting dates beyond this horizon will result in weather data fetch failures.

### 2.2 System Visuals
*(Note: If the live server is down due to cloud credit limitations, please refer to the media below for system functionality.)*

> **[Insert Screenshot of Dashboard Here - image_e15b3e.png]**
> *Caption: The UrbanFlow AI primary telemetry dashboard illustrating real-time inference, spatial density, and system KPIs.*

> **[https://github.com/user-attachments/assets/417190e9-09c5-468f-8820-32502f995822]**

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
## 4. The Intelligence Layer (Backend)

The backend is constructed using **FastAPI (`main.py`)** to handle high-concurrency asynchronous requests. It loads the serialized LightGBM pipeline and a 30-day historical seed matrix into memory upon startup using FastAPI's lifespan context manager.

### 4.1 The Recursive Forecasting Loop (`forecasting_service.py`)

Standard models predict a single step ahead. UrbanFlow AI implements a dynamic autoregressive recursion loop to project demand across user-defined horizons (e.g., 12 steps / 3 hours).

For a given horizon **H**:

1. The system fetches weather context via `weather_service.py`.
2. It engineers temporal and cyclical features for time **t**.
3. The LightGBM model predicts demand **ŷₜ**.
4. **Recursion:** **ŷₜ** is appended to the historical seed matrix, acting as the ground-truth lag feature for time **t + 1**.
5. The loop advances until **t + H** is reached.

### 4.2 Dynamic Feature Engineering (`feature_engineering.py`)

To match the dimensionality of the training data, the backend dynamically reconstructs **76 features** on the fly, including:

- **Topological Time:** Trigonometric transformations of the hour and day (`hour_sin`, `hour_cos`).
- **Categorical Encoding:** Converting raw temperatures into discrete bins (`freezing`, `cold`, `mild`) compatible with LightGBM's native categorical handling.

---

## 5. The Telemetry Dashboard (Frontend)

The frontend is engineered using **React**, **Vite**, and **Tailwind CSS**, featuring high-performance data visualizations via **Recharts** and fluid animations via **Framer Motion**.

### 5.1 Key Performance Indicator (KPI) Module

The `KPISection.jsx` distills complex inference matrices into immediate, actionable operational metrics:

- **T+1 Demand:** Extracts the very first predicted value (**t + 1**) from the recursive backend array and applies `Math.round()` to provide fleet dispatchers with the immediate impending vehicle requirement.
- **Est. Temp & Condition:** Parses the asynchronous payload from the Open-Meteo integration to display the precise localized weather conditions feeding into the current model prediction.
- **Active Region:** Displays the currently selected K-Means spatial cluster ID.

### 5.2 Analytical Interface Components

#### Demand Trajectory (Forecast Chart)

Utilizes Recharts to map a continuous `ComposedChart`. It splices the 48-hour historical seed data with the newly generated future projection array, providing a seamless visual transition between past demand and forecasted surges.

#### Spatial Heatmap (`DemandHeatmap.jsx`)

A custom interactive grid mapping the **30 localized density clusters** established during the baseline EDA phase. It visually categorizes regional stress into **High**, **Medium**, and **Low** thresholds.

#### Live Feature Importance (`FeatureImportance.jsx`)

A transparency module that ranks the core drivers of the LightGBM model (e.g., `region_lag_1`, `rolling_mean_24`), allowing operators to understand why the model is projecting a specific demand curve.

---

## 6. Infrastructure and Deployment Configuration

The application is containerized and orchestrated for cloud deployment, utilizing custom environment configurations to satisfy machine learning dependencies.

### 6.1 Dependency Management (`nixpacks.toml` & `Dockerfile`)

LightGBM requires the OpenMP API for parallel processing natively at the OS level. Standard Python slim images lack this C-library.

The deployment pipeline explicitly resolves this by injecting OS-level dependencies via `apt.txt` and `nixpacks.toml`:

```toml
[phases.setup]
aptPkgs = ["libgomp1"]
```

The `Dockerfile` establishes a lightweight `python:3.11-slim` environment, installs `libgomp1`, and exposes the Uvicorn server on port **8000**.

### 6.2 Environment Security (`.env` & CORS)

The backend enforces strict Cross-Origin Resource Sharing (CORS) policies. The `main.py` middleware is dynamically bound to the frontend's specific IP (`http://140.238.240.219`), preventing unauthorized external API calls from depleting the server's computational resources.

---

## 7. Local Development Setup

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

## Academic Context

Engineered and developed by **Soham Mahesh Gaonkhadkar**, Department of Chemical Engineering, *Indian Institute of Technology Kharagpur*.

This repository serves as a comprehensive demonstration of:

- Large-scale data engineering
- API integration
- Interactive client-side rendering
- Production-grade machine learning deployment
- Cloud-native infrastructure design
- Full-stack AI system development
