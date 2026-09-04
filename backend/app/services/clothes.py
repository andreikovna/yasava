import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.clothes import Clothes
from app.schemas.clothes import ClothesResponse
from app.services.photos import delete_photo


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


def to_clothes_response(item: Clothes) -> ClothesResponse:
    photo = item.photo_path
    photo_url = photo if photo.startswith("/") else f"/uploads/{photo}"
    return ClothesResponse(
        id=item.id,
        profile_id=item.profile_id,
        photo_url=photo_url,
        category=item.category,
        color=item.color,
        season=item.season,
        style=item.style,
        created_at=item.created_at,
    )


async def delete_clothes(db: AsyncSession, item: Clothes) -> None:
    delete_photo(item.photo_path)
    await db.delete(item)
    await db.commit()
