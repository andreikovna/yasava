from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import app.models  # noqa: F401 — register all SQLAlchemy models
from app.config import settings
from app.routers import auth, clothes, outfits, profiles

app = FastAPI(
    title="Yasava — Digital Wardrobe",
    description="API for the digital wardrobe app",
    version="0.1.0",
)

# Needed for Expo web: the browser sends OPTIONS before POST. Native apps skip CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(clothes.router)
app.include_router(outfits.router)

upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")


@app.get("/")
async def root():
    return {"message": "Yasava API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
