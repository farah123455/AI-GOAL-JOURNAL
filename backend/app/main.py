from fastapi import FastAPI
from app.api.v1.users import router as users_router

app = FastAPI(title="AI Goal Journal API")

@app.get("/")
def root():
    return {"message": "AI Goal Journal Backend Running"}

app.include_router(users_router, prefix="/api/v1")