import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.clothes import ClothesResponse, Season


class OutfitCreate(BaseModel):
    profile_id: uuid.UUID
    name: str = Field(min_length=1, max_length=200)
    occasion: str | None = Field(default=None, max_length=100)
    season: Season | None = None
    clothing_ids: list[uuid.UUID] = Field(min_length=1)


class OutfitUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    occasion: str | None = Field(default=None, max_length=100)
    season: Season | None = None
    clothing_ids: list[uuid.UUID] | None = Field(default=None, min_length=1)


class OutfitResponse(BaseModel):
    id: uuid.UUID
    profile_id: uuid.UUID
    name: str
    occasion: str | None
    season: str | None
    created_at: datetime
    items: list[ClothesResponse]
