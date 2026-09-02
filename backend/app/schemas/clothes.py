import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class Category(str, Enum):
    top = "top"
    bottom = "bottom"
    dress = "dress"
    outerwear = "outerwear"
    shoes = "shoes"
    accessory = "accessory"
    underwear = "underwear"
    sportswear = "sportswear"
    other = "other"


class Season(str, Enum):
    winter = "winter"
    spring = "spring"
    summer = "summer"
    autumn = "autumn"
    all_season = "all_season"


class ClothesCreate(BaseModel):
    category: Category
    color: str | None = None
    season: Season | None = None
    style: str | None = None


class ClothesUpdate(BaseModel):
    category: Category | None = None
    color: str | None = None
    season: Season | None = None
    style: str | None = None


class ClothesResponse(BaseModel):
    id: uuid.UUID
    profile_id: uuid.UUID
    photo_url: str
    category: str
    color: str | None
    season: str | None
    style: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
