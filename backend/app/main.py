from fastapi import FastAPI

import app.models  # noqa: F401 — register all SQLAlchemy models
from app.routers import auth

app = FastAPI(
    title="Yasava — Digital Wardrobe",
    description="API for the digital wardrobe app",
    version="0.1.0",
)

app.include_router(auth.router)


@app.get("/")
async def root():
    return {"message": "Yasava API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
