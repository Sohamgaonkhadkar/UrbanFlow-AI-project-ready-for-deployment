import pandas as pd
import numpy as np
import holidays

def build_features(df_context: pd.DataFrame, target_ts: pd.Timestamp, weather_df: pd.DataFrame, feature_columns: list) -> pd.DataFrame:
    """Generates features using expanding mean imputation. NEVER drops rows."""
    df = df_context.copy()
    
    # 1. Time Features
    df["hour"] = df.index.hour
    df["day"] = df.index.day
    df["month"] = df.index.month
    df["day_of_week"] = df.index.dayofweek
    df["is_weekend"] = (df.index.dayofweek >= 5).astype(int)
    df["is_peak_hour"] = df["hour"].isin([7, 8, 9, 17, 18, 19]).astype(int)
    df["is_night"] = df["hour"].isin([0, 1, 2, 3, 4, 5]).astype(int)

    # 2. Cyclical Features
    df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
    df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
    df["dow_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
    df["dow_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

    # 3. Lags & Expanding Mean Imputation
    lags = [1, 24, 168, 336, 720]
    base_pickup = df["total_pickups"]
    
    for lag in lags:
        raw_lag = base_pickup.shift(lag)
        if lag >= 24:
            df[f"lag_{lag}_available"] = raw_lag.notna().astype(int)
            df[f"region_lag_{lag}_available"] = df[f"lag_{lag}_available"]
            
        expanding_mean = raw_lag.expanding(min_periods=1).mean()
        df[f"lag_{lag}"] = raw_lag.fillna(expanding_mean)
        df[f"region_lag_{lag}"] = df[f"lag_{lag}"] 

    # 4. Rolling Features
    base_shifted = base_pickup.shift(1)
    df["rolling_mean_24"] = base_shifted.rolling(24, min_periods=1).mean()
    df["rolling_std_24"] = base_shifted.rolling(24, min_periods=1).std().fillna(0)
    df["rolling_mean_168"] = base_shifted.rolling(168, min_periods=1).mean()
    df["rolling_std_168"] = base_shifted.rolling(168, min_periods=1).std().fillna(0)
    df["rolling_mean_720"] = base_shifted.rolling(720, min_periods=1).mean()

    # 5. Conditional Rolling
    weekend_mask = df.index.dayofweek >= 5
    df["rolling_mean_weekend_24"] = base_shifted.where(weekend_mask).rolling(24, min_periods=1).mean().fillna(df["rolling_mean_24"])
    
    us_hols = holidays.US(years=[target_ts.year, target_ts.year-1])
    df["is_holiday"] = df.index.normalize().isin(us_hols).astype(int)
    holiday_mask = df["is_holiday"] == 1
    df["rolling_mean_holiday_24"] = base_shifted.where(holiday_mask).rolling(24, min_periods=1).mean().fillna(df["rolling_mean_24"])

    # 6. Weather Integration
    weather_cols = ["temperature_2m", "is_raining", "is_snowing"]
    df['hour_floor'] = df.index.floor('H')
    df = df.merge(weather_df[weather_cols], left_on='hour_floor', right_index=True, how='left')
    df = df.drop(columns=['hour_floor'])
    df[weather_cols] = df[weather_cols].ffill().fillna(0)

    # 7. Interactions
    df["rain_x_peak_hour"] = df["is_raining"] * df["is_peak_hour"]
    df["weekend_hour_interaction"] = df["is_weekend"] * df["hour"]
    df["snow_x_night"] = df["is_snowing"] * df["is_night"]
    df["rain_x_weekend"] = df["is_raining"] * df["is_weekend"]

    # 8. Target row isolation & Alignment
    target_row = df.loc[[target_ts]].copy()
    
    for col in feature_columns:
        if col not in target_row.columns:
            target_row[col] = 0
            
    return target_row[feature_columns]