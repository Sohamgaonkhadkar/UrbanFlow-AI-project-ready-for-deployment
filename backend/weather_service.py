import httpx
import pandas as pd
from tenacity import retry, wait_exponential, stop_after_attempt

WEATHER_CACHE = {}

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def fetch_weather_context(target_date: str) -> pd.DataFrame:
    """Fetches weather from Open-Meteo with caching and tenacity retries."""
    if target_date in WEATHER_CACHE:
        return WEATHER_CACHE[target_date]

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "start_date": target_date,
        "end_date": target_date,
        "hourly": "temperature_2m,precipitation,snowfall",
        "timezone": "America/New_York",
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
        
    weather = pd.DataFrame(data["hourly"])
    weather["time"] = pd.to_datetime(weather["time"])
    weather = weather.set_index("time")
    
    weather["is_raining"] = (weather["precipitation"] > 0).astype(int)
    weather["is_snowing"] = (weather["snowfall"] > 0).astype(int)
    
    WEATHER_CACHE[target_date] = weather
    return weather