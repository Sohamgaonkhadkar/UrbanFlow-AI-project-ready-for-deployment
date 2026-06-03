import pandas as pd
from feature_engineering import build_features
from weather_service import fetch_weather_context

async def generate_recursive_forecast(
    region,
    start_datetime: pd.Timestamp,
    horizon: int,
    seed_data: pd.DataFrame,
    pipeline: dict
):
    model = pipeline["model"]
    feature_columns = pipeline["feature_columns"]
    cat_cols = pipeline["categorical_columns"]

    # Ensure matching datatype
    current_df = seed_data[
        seed_data["region"].astype(str) == str(region)
    ].copy()

    print(f"\nForecast Region: {region}")
    print(f"Seed Rows Found: {len(current_df)}")

    if current_df.empty:
        raise ValueError(
            f"No historical data found for region {region}"
        )

    target_date_str = start_datetime.strftime("%Y-%m-%d")
    weather_df = await fetch_weather_context(target_date_str)

    forecasts = []
    current_ts = start_datetime

    print("\nForecast Sequence:")

    for step in range(horizon):

        # Add future timestamp
        current_df.loc[current_ts] = pd.NA
        current_df.at[current_ts, "region"] = region

        # Build features
        X_step = build_features(
            current_df,
            current_ts,
            weather_df,
            feature_columns
        )

        # Convert categorical features
        for c in cat_cols:
            if c in X_step.columns:
                X_step[c] = X_step[c].astype("category")

        # Predict
        pred = max(
            0,
            float(model.predict(X_step)[0])
        )

        print(
            f"Step {step+1}: "
            f"{current_ts} -> {pred:.2f}"
        )

        forecasts.append({
            "datetime": str(current_ts),
            "prediction": round(pred, 2)
        })

        # Recursive feedback
        current_df.at[current_ts, "total_pickups"] = pred

        current_ts += pd.Timedelta(minutes=15)

    try:
        weather_row = weather_df.loc[
            start_datetime.floor("H")
        ]

        w_temp = float(
            weather_row["temperature_2m"]
        )

        w_cond = (
            "Rain"
            if weather_row["is_raining"] == 1
            else "Clear"
        )

    except Exception:
        w_temp = 15.0
        w_cond = "Unknown"

    return forecasts, {
        "temperature": w_temp,
        "condition": w_cond
    }