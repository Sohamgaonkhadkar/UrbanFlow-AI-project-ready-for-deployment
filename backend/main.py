from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "working"}

@app.get("/health")
def health():
    return {"healthy": True}
