from fastapi import FastAPI

app = FastAPI(title="AI Goal Journal & Accountability Coach")


@app.get("/")
def root():
    return {"message": "AI Goal Journal API is running"}