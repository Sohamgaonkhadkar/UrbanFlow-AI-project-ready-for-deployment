import pandas as pd
import os

# 1. Load the old 2016 data
file_path = "data/historical_seed_data.csv"
df = pd.read_csv(file_path, index_col=0, parse_dates=True)

# 2. Calculate the exact time gap between 2016 and right now
time_shift = pd.Timestamp.now().floor('H') - df.index.max()

# 3. Fast-forward the data to today
df.index = df.index + time_shift

# 4. Save it back to the CSV
df.to_csv(file_path)
print("Success! Seed data has been shifted to the present day.")