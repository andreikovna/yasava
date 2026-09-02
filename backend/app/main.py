from fastapi import FastAPI

app = FastAPI(
    title="Yasava — Digital Wardrobe",
    description="API for the digital wardrobe app",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {"message": "Yasava API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
