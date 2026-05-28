# UrbanFlow AI: Real-Time NYC Taxi Demand Forecasting

UrbanFlow AI is a high-performance machine learning platform engineered to forecast urban mobility demand. By leveraging LightGBM gradient-boosting regressors within a recursive time-series framework, the system provides high-fidelity, multi-step demand predictions for New York City taxi services. This platform integrates complex feature engineering—including temporal cyclicity, historical lag dependencies, and real-time atmospheric data—into a production-ready system.

## System Architecture

The project is built on a decoupled full-stack architecture to ensure modularity, scalability, and maintainability.

* **Inference Engine (Backend):** Developed in FastAPI, this service handles real-time model inference. It utilizes a pre-trained LightGBM pipeline to process recursive forecasts.
* **Intelligence Layer:** Features a custom forecasting service that manages stateful memory, computes rolling statistics, and integrates external weather telemetry.
* **Interface (Frontend):** A React-based dashboard providing real-time telemetry, visual analysis of model confidence intervals, and scenario-based demand injection.



## Core Technology Stack

The platform is constructed using a robust set of professional-grade engineering tools:

### Machine Learning & Data Processing
* **LightGBM:** High-performance gradient boosting framework used for regression modeling.
* **Scikit-Learn:** Employed for pipeline construction and preprocessing workflows.
* **Pandas & NumPy:** Utilized for high-performance data manipulation, rolling window calculations, and lag feature generation.
* **Joblib:** Used for efficient serialization and deserialization of the model pipeline.
* **Optuna:** Implemented for automated hyperparameter optimization to ensure model convergence.

### Backend Infrastructure
* **FastAPI:** High-performance asynchronous web framework for building the prediction API.
* **Uvicorn:** ASGI web server implementation used for production-grade request handling.
* **Tenacity:** Used for robust retry logic when querying external weather services.

### Frontend & Visualization
* **React & Vite:** A fast, modular framework for building the interactive user interface.
* **Tailwind CSS:** Utility-first CSS framework for responsive and modern UI styling.
* **Recharts:** Composed charting library used for rendering demand curves and confidence intervals.
* **Framer Motion:** Implemented for fluid UI transitions and interactive data visualization.
* **Axios:** Promise-based HTTP client for seamless communication between the frontend and the FastAPI backend.

## Technical Specifications

### Forecasting Methodology
The platform employs a recursive autoregressive strategy. This approach iteratively feeds model predictions back into the feature set to forecast subsequent time steps ($t+1, t+2, \dots, t+n$), ensuring internal consistency across the forecast horizon.

### Model Performance
The LightGBM regression pipeline achieved the following validation metrics:

| Metric | Score |
| :--- | :--- |
| Mean Absolute Error (MAE) | 12.41 |
| Root Mean Square Error (RMSE) | 20.04 |
| Weighted Absolute Percentage Error (WAPE) | 9.41% |
| Coefficient of Determination ($R^2$) | 0.9764 |

## Repository Structure

```text
urbanflow-ai/
├── backend/
│   ├── main.py                # FastAPI routing and lifecycle management
│   ├── feature_engineering.py # Data transformation and pipeline logic
│   ├── forecasting_service.py # Recursive inference implementation
│   ├── weather_service.py     # External API telemetry integration
│   └── data/                  # Serialized model pipeline and seed memory
├── frontend/                  # React-based analytical dashboard
└── README.md
