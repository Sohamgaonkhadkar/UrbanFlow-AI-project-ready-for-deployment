from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from contextlib import asynccontextmanager
import os

from services.forecasting_service import generate_recursive_forecast

# Global State
PIPELINE = {}
SEED_DATA = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "data", "lgbm_taxi_pipeline.pkl")
SEED_PATH = os.path.join(BASE_DIR, "data", "historical_seed_data.csv")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global PIPELINE, SEED_DATA
    print("[UrbanFlow AI] Loading LightGBM Pipeline...")
    PIPELINE = joblib.load(MODEL_PATH) 
    print("[UrbanFlow AI] Loading 30-Day Seed Memory...")
    SEED_DATA = pd.read_csv(SEED_PATH, index_col=0, parse_dates=True)
    yield
    print("[UrbanFlow AI] Shutting down...")

app = FastAPI(title="UrbanFlow AI Engine", lifespan=lifespan)

# --- DEPLOYMENT FIX: DYNAMIC CORS ---
# This allows you to list your live website URL in your environment variables
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    region: str
    datetime: str 
    horizon: int = 12

@app.post("/predict")
async def predict_demand(request: PredictRequest):
    try:
        target_ts = pd.to_datetime(request.datetime)
        
        forecast_data, weather_context = await generate_recursive_forecast(
            region=request.region,
            start_datetime=target_ts,
            horizon=request.horizon,
            seed_data=SEED_DATA,
            pipeline=PIPELINE
        )
        
        # Extract 48 hours of history for chart
        history_df = SEED_DATA[SEED_DATA["region"] == request.region].copy()
        history_df = history_df[history_df.index < target_ts].tail(192)
        history = [{"datetime": str(idx), "actual": float(row["total_pickups"])} 
                    for idx, row in history_df.iterrows() if pd.notna(row["total_pickups"])]
        
        return {
            "forecast": forecast_data,
            "history": history,
            "weather": weather_context
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))