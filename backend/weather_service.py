import httpx
import pandas as pd
import numpy as np

from tenacity import (
    retry,
    wait_exponential,
    stop_after_attempt
)

WEATHER_CACHE = {}

@retry(
    wait=wait_exponential(
        multiplier=1,
        min=2,
        max=10
    ),
    stop=stop_after_attempt(3)
)
async def fetch_weather_context(
    target_date: str
) -> pd.DataFrame:

    if target_date in WEATHER_CACHE:
        return WEATHER_CACHE[target_date]

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "start_date": target_date,
        "end_date": target_date,
        "hourly": (
            "temperature_2m,"
            "apparent_temperature,"
            "precipitation,"
            "snowfall,"
            "snow_depth,"
            "windspeed_10m,"
            "cloudcover,"
            "relativehumidity_2m"
        ),
        "timezone": "America/New_York",
    }

    async with httpx.AsyncClient() as client:

        resp = await client.get(
            url,
            params=params,
            timeout=10.0
        )
        print("\nAPI STATUS:", resp.status_code)
        print("\nAPI RESPONSE:")    
        print(resp.text)


        resp.raise_for_status()

        data = resp.json()

    weather = pd.DataFrame(
        data["hourly"]
    )

    weather["time"] = pd.to_datetime(
        weather["time"]
    )

    weather = weather.set_index(
        "time"
    )

    # ==================================
    # WEATHER FLAGS
    # ==================================

    weather["is_raining"] = (
        weather["precipitation"] > 0
    ).astype(int)

    weather["is_snowing"] = (
        weather["snowfall"] > 0
    ).astype(int)

    weather["is_heavy_weather"] = (
        (weather["precipitation"] > 5)
        |
        (weather["snowfall"] > 1)
    ).astype(int)

    weather["is_freezing"] = (
        weather["temperature_2m"] <= 0
    ).astype(int)

    weather["is_storm_jonas"] = 0

    # ==================================
    # TEMP BIN
    # ==================================

    weather["temp_bin"] = pd.cut(
        weather["temperature_2m"],
        bins=[
            -100,
            0,
            10,
            20,
            100
        ],
        labels=[
            "freezing",
            "cold",
            "mild",
            "warm"
        ]
    ).astype(str)

    # ==================================
    # WEATHER CONDITION
    # ==================================

    weather["weather_condition"] = np.select(
        [
            weather["snowfall"] > 0,
            weather["precipitation"] > 0
        ],
        [
            "snow",
            "rain"
        ],
        default="clear"
    )
    print("\nWEATHER COLUMNS:")
    print(weather.columns.tolist())
    WEATHER_CACHE[target_date] = weather

    return weather