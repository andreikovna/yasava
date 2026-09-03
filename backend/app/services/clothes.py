import uuid
import shutil
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.clothes import Clothes

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def _validate_image(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type {ext} not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}")
    return ext


async def save_photo(file: UploadFile, profile_id: uuid.UUID) -> str:
    ext = _validate_image(file.filename or "photo.jpg")
    file_name = f"{profile_id}_{uuid.uuid4().hex}{ext}"

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / file_name
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_name


async def create_clothes(
    db: AsyncSession,
    profile_id: uuid.UUID,
    photo_filename: str,
    category: str,
    color: str | None,
    season: str | None,
    style: str | None,
) -> Clothes:
    item = Clothes(
        profile_id=profile_id,
        photo_path=photo_filename,
        category=category,
        color=color,
        season=season,
        style=style,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def get_clothes_by_profile(
    db: AsyncSession,
    profile_id: uuid.UUID,
    category: str | None = None,
    season: str | None = None,
) -> list[Clothes]:
    query = select(Clothes).where(Clothes.profile_id == profile_id)
    if category:
        query = query.where(Clothes.category == category)
    if season:
        query = query.where(Clothes.season == season)
    query = query.order_by(Clothes.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_clothes_by_id(db: AsyncSession, clothes_id: uuid.UUID) -> Clothes | None:
    result = await db.execute(select(Clothes).where(Clothes.id == clothes_id))
    return result.scalar_one_or_none()


async def update_clothes(
    db: AsyncSession,
    item: Clothes,
    category: str | None = None,
    color: str | None = None,
    season: str | None = None,
    style: str | None = None,
) -> Clothes:
    if category is not None:
        item.category = category
    if color is not None:
        item.color = color
    if season is not None:
        item.season = season
    if style is not None:
        item.style = style
    await db.commit()
    await db.refresh(item)
    return item


async def delete_clothes(db: AsyncSession, item: Clothes) -> None:
    photo_path = Path(settings.UPLOAD_DIR) / item.photo_path
    if photo_path.exists():
        photo_path.unlink()
    await db.delete(item)
    await db.commit()
