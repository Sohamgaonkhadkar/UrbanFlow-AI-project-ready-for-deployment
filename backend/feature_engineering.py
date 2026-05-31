import pandas as pd
import numpy as np
import holidays

def build_features(
    df_context: pd.DataFrame,
    target_ts: pd.Timestamp,
    weather_df: pd.DataFrame,
    feature_columns: list
) -> pd.DataFrame:

    df = df_context.copy()

    # =====================================================
    # 1. TIME FEATURES
    # =====================================================

    df["hour"] = df.index.hour
    df["day"] = df.index.day
    df["month"] = df.index.month
    df["day_of_week"] = df.index.dayofweek

    df["is_weekend"] = (
        df.index.dayofweek >= 5
    ).astype(int)

    df["is_peak_hour"] = (
        df["hour"].isin([7, 8, 9, 17, 18, 19])
    ).astype(int)

    df["is_night"] = (
        df["hour"].isin([0, 1, 2, 3, 4, 5])
    ).astype(int)

    # =====================================================
    # 2. CYCLICAL FEATURES
    # =====================================================

    df["hour_sin"] = np.sin(
        2 * np.pi * df["hour"] / 24
    )

    df["hour_cos"] = np.cos(
        2 * np.pi * df["hour"] / 24
    )

    df["dow_sin"] = np.sin(
        2 * np.pi * df["day_of_week"] / 7
    )

    df["dow_cos"] = np.cos(
        2 * np.pi * df["day_of_week"] / 7
    )

    df["month_sin"] = np.sin(
        2 * np.pi * df["month"] / 12
    )

    df["month_cos"] = np.cos(
        2 * np.pi * df["month"] / 12
    )

    # =====================================================
    # 3. LAG FEATURES
    # =====================================================

    lags = [1, 24, 168, 336, 720]

    base_pickup = df["total_pickups"]

    for lag in lags:

        raw_lag = base_pickup.shift(lag)

        if lag >= 24:

            df[f"lag_{lag}_available"] = (
                raw_lag.notna()
            ).astype(int)

            df[f"region_lag_{lag}_available"] = (
                df[f"lag_{lag}_available"]
            )

        expanding_mean = (
            raw_lag
            .expanding(min_periods=1)
            .mean()
        )

        df[f"lag_{lag}"] = (
            raw_lag
            .fillna(expanding_mean)
            .infer_objects(copy=False)
        )

        df[f"region_lag_{lag}"] = (
            df[f"lag_{lag}"]
        )

    # =====================================================
    # 4. ROLLING FEATURES
    # =====================================================

    base_shifted = base_pickup.shift(1)

    df["rolling_mean_24"] = (
        base_shifted
        .rolling(24, min_periods=1)
        .mean()
    )

    df["rolling_std_24"] = (
        base_shifted
        .rolling(24, min_periods=1)
        .std()
        .fillna(0)
    )

    df["rolling_mean_168"] = (
        base_shifted
        .rolling(168, min_periods=1)
        .mean()
    )

    df["rolling_std_168"] = (
        base_shifted
        .rolling(168, min_periods=1)
        .std()
        .fillna(0)
    )

    df["rolling_mean_720"] = (
        base_shifted
        .rolling(720, min_periods=1)
        .mean()
    )

    # =====================================================
    # 5. CONDITIONAL ROLLING
    # =====================================================

    weekend_mask = (
        df.index.dayofweek >= 5
    )

    df["rolling_mean_weekend_24"] = (
        base_shifted
        .where(weekend_mask)
        .rolling(24, min_periods=1)
        .mean()
        .fillna(df["rolling_mean_24"])
    )

    us_hols = holidays.US(
        years=[target_ts.year, target_ts.year - 1]
    )

    holiday_dates = pd.to_datetime(
        list(us_hols.keys())
    )

    df["is_holiday"] = (
        df.index.normalize()
        .isin(holiday_dates)
    ).astype(int)

    holiday_mask = (
        df["is_holiday"] == 1
    )

    df["rolling_mean_holiday_24"] = (
        base_shifted
        .where(holiday_mask)
        .rolling(24, min_periods=1)
        .mean()
        .fillna(df["rolling_mean_24"])
    )

    # =====================================================
    # 6. WEATHER FEATURES
    # =====================================================

    weather_cols = [
         "temperature_2m",
    "apparent_temperature",
    "precipitation",
    "snowfall",
    "snow_depth",
    "windspeed_10m",
    "cloudcover",
    "relativehumidity_2m",
    "is_raining",
    "is_snowing",
    "is_heavy_weather",
    "is_freezing",
    "is_storm_jonas",
    "temp_bin",
    "weather_condition"
    ]

    # Make BOTH timezone-naive
    df["hour_floor"] = (
        pd.to_datetime(df.index)
        .floor("h")
        .tz_localize(None)
    )

    weather_df = weather_df.copy()

    weather_df.index = (
        pd.to_datetime(weather_df.index)
        .tz_localize(None)
    )

    df = df.merge(
        weather_df[weather_cols],
        left_on="hour_floor",
        right_index=True,
        how="left"
    )

    df.drop(
        columns=["hour_floor"],
        inplace=True
    )
    
    # Use latest weather values from merge
    for col in weather_cols:
        if f"{col}_y" in df.columns:
            df[col] = df[f"{col}_y"]

    # remove duplicate columns
    drop_cols = []

    for col in weather_cols:
        if f"{col}_x" in df.columns:
            drop_cols.append(f"{col}_x")

        if f"{col}_y" in df.columns:
            drop_cols.append(f"{col}_y")

    df.drop(columns=drop_cols, inplace=True)

    df[weather_cols] = (
        df[weather_cols]
        .ffill()
        .fillna(0)
    )

    # =====================================================
    # 7. INTERACTION FEATURES
    # =====================================================

    df["rain_x_peak_hour"] = (
        df["is_raining"]
        * df["is_peak_hour"]
    )

    df["weekend_hour_interaction"] = (
        df["is_weekend"]
        * df["hour"]
    )

    df["snow_x_night"] = (
        df["is_snowing"]
        * df["is_night"]
    )

    df["rain_x_weekend"] = (
        df["is_raining"]
        * df["is_weekend"]
    )

    # =====================================================
    # 8. TARGET ROW
    # =====================================================

    target_row = df.loc[[target_ts]].copy()

    for col in feature_columns:

        if col not in target_row.columns:
            target_row[col] = 0

    
        # =====================================================
    # FINAL FEATURE ALIGNMENT
    # =====================================================

    target_row = target_row[feature_columns].copy()

    categorical_cols = [
        "holiday_name",
        "temp_bin",
        "weather_condition"
    ]

    for col in target_row.columns:

        if col in categorical_cols:

            target_row[col] = (
                target_row[col]
                .astype(str)
            )

            target_row[col] = (
                target_row[col]
                .replace("nan", "unknown")
            )

            target_row[col] = (
                target_row[col]
                .fillna("unknown")
                .astype("category")
            )

        else:

            target_row[col] = pd.to_numeric(
                target_row[col],
                errors="coerce"
            )

    # fill ONLY numeric columns
    numeric_cols = target_row.select_dtypes(
        include=["number"]
    ).columns

    target_row[numeric_cols] = (
        target_row[numeric_cols]
        .fillna(0)
    )

    print("\nCOLUMN DTYPES:")
    print(target_row.dtypes)

    return target_row