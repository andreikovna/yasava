import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.clothes import Clothes
from app.models.outfit import Outfit, OutfitItem
from app.schemas.outfit import OutfitResponse
from app.services.clothes import to_clothes_response

_OUTFIT_ITEMS = selectinload(Outfit.items).selectinload(OutfitItem.clothing)


async def _validate_clothing_ids(
    db: AsyncSession,
    profile_id: uuid.UUID,
    clothing_ids: list[uuid.UUID],
) -> None:
    if len(clothing_ids) != len(set(clothing_ids)):
        raise ValueError("Duplicate clothing items are not allowed")

    result = await db.execute(
        select(Clothes.id).where(
            Clothes.id.in_(clothing_ids),
            Clothes.profile_id == profile_id,
        )
    )
    found = {row[0] for row in result.all()}
    if len(found) != len(clothing_ids):
        raise ValueError("Some clothing items were not found in this profile")


def to_outfit_response(outfit: Outfit) -> OutfitResponse:
    return OutfitResponse(
        id=outfit.id,
        profile_id=outfit.profile_id,
        name=outfit.name,
        occasion=outfit.occasion,
        season=outfit.season,
        created_at=outfit.created_at,
        items=[to_clothes_response(link.clothing) for link in outfit.items],
    )


async def get_outfit_by_id(db: AsyncSession, outfit_id: uuid.UUID) -> Outfit | None:
    result = await db.execute(
        select(Outfit).options(_OUTFIT_ITEMS).where(Outfit.id == outfit_id)
    )
    return result.scalar_one_or_none()


async def get_outfits_by_profile(
    db: AsyncSession,
    profile_id: uuid.UUID,
    season: str | None = None,
    occasion: str | None = None,
) -> list[Outfit]:
    query = (
        select(Outfit)
        .options(_OUTFIT_ITEMS)
        .where(Outfit.profile_id == profile_id)
        .order_by(Outfit.created_at.desc())
    )
    if season:
        query = query.where(Outfit.season == season)
    if occasion:
        query = query.where(Outfit.occasion == occasion)
    result = await db.execute(query)
    return list(result.scalars().all())


async def create_outfit(
    db: AsyncSession,
    profile_id: uuid.UUID,
    name: str,
    occasion: str | None,
    season: str | None,
    clothing_ids: list[uuid.UUID],
) -> Outfit:
    await _validate_clothing_ids(db, profile_id, clothing_ids)
    outfit = Outfit(
        profile_id=profile_id,
        name=name,
        occasion=occasion,
        season=season,
        items=[OutfitItem(clothing_id=clothing_id) for clothing_id in clothing_ids],
    )
    db.add(outfit)
    await db.commit()
    loaded = await get_outfit_by_id(db, outfit.id)
    assert loaded is not None
    return loaded


async def update_outfit(
    db: AsyncSession,
    outfit: Outfit,
    name: str | None = None,
    occasion: str | None = None,
    season: str | None = None,
    clothing_ids: list[uuid.UUID] | None = None,
) -> Outfit:
    if name is not None:
        outfit.name = name
    if occasion is not None:
        outfit.occasion = occasion
    if season is not None:
        outfit.season = season
    if clothing_ids is not None:
        await _validate_clothing_ids(db, outfit.profile_id, clothing_ids)
        outfit.items.clear()
        await db.flush()
        outfit.items = [
            OutfitItem(clothing_id=clothing_id) for clothing_id in clothing_ids
        ]
    await db.commit()
    loaded = await get_outfit_by_id(db, outfit.id)
    assert loaded is not None
    return loaded


async def delete_outfit(db: AsyncSession, outfit: Outfit) -> None:
    await db.delete(outfit)
    await db.commit()
