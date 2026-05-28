import pandas as pd
from feature_engineering import build_features
from weather_service import fetch_weather_context

async def generate_recursive_forecast(region: str, start_datetime: pd.Timestamp, horizon: int, seed_data: pd.DataFrame, pipeline: dict):
    """Executes the recursive prediction loop step-by-step."""
    model = pipeline["model"]
    feature_columns = pipeline["feature_columns"]
    cat_cols = pipeline["categorical_columns"]
    
    current_df = seed_data[seed_data["region"] == region].copy()
    
    target_date_str = start_datetime.strftime("%Y-%m-%d")
    weather_df = await fetch_weather_context(target_date_str)
    
    forecasts = []
    current_ts = start_datetime
    
    for _ in range(horizon):
        # Insert placeholder
        current_df.loc[current_ts] = pd.NA
        current_df.at[current_ts, "region"] = region
        
        # Engineer features
        X_step = build_features(current_df, current_ts, weather_df, feature_columns)
        
        for c in cat_cols:
            if c in X_step.columns:
                X_step[c] = X_step[c].astype("category")
                
        # Predict & enforce non-negative constraint
        pred = max(0, float(model.predict(X_step)[0]))
        
        forecasts.append({"datetime": str(current_ts), "prediction": pred})
        
        # Recursion: Seed the past with the prediction
        current_df.at[current_ts, "total_pickups"] = pred
        current_ts = current_ts + pd.Timedelta(minutes=15)
        
    try:
        w_temp = float(weather_df.loc[start_datetime.floor('H')]["temperature_2m"])
        w_cond = "Rain" if weather_df.loc[start_datetime.floor('H')]["is_raining"] == 1 else "Clear"
    except:
        w_temp, w_cond = 15.0, "Unknown"

    return forecasts, {"temperature": w_temp, "condition": w_cond}