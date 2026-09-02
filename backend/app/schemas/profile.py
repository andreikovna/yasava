import uuid

from pydantic import BaseModel


class ProfileCreate(BaseModel):
    name: str


class ProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    avatar_url: str | None

    model_config = {"from_attributes": True}
