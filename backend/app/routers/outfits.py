import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, get_user_profile
from app.models.user import User
from app.schemas.clothes import Season
from app.schemas.outfit import OutfitCreate, OutfitResponse, OutfitUpdate
from app.services.outfits import (
    create_outfit,
    delete_outfit,
    get_outfit_by_id,
    get_outfits_by_profile,
    to_outfit_response,
    update_outfit,
)

router = APIRouter(prefix="/outfits", tags=["outfits"])


@router.post("/", response_model=OutfitResponse, status_code=status.HTTP_201_CREATED)
async def add_outfit(
    data: OutfitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await get_user_profile(data.profile_id, current_user, db)
    try:
        outfit = await create_outfit(
            db,
            profile_id=data.profile_id,
            name=data.name,
            occasion=data.occasion,
            season=data.season.value if data.season else None,
            clothing_ids=data.clothing_ids,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return to_outfit_response(outfit)


@router.get("/", response_model=list[OutfitResponse])
async def list_outfits(
    profile_id: uuid.UUID = Query(...),
    season: Season | None = Query(None),
    occasion: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await get_user_profile(profile_id, current_user, db)
    outfits = await get_outfits_by_profile(
        db,
        profile_id,
        season=season.value if season else None,
        occasion=occasion,
    )
    return [to_outfit_response(outfit) for outfit in outfits]


@router.get("/{outfit_id}", response_model=OutfitResponse)
async def get_outfit(
    outfit_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    outfit = await get_outfit_by_id(db, outfit_id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    await get_user_profile(outfit.profile_id, current_user, db)
    return to_outfit_response(outfit)


@router.patch("/{outfit_id}", response_model=OutfitResponse)
async def edit_outfit(
    outfit_id: uuid.UUID,
    data: OutfitUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    outfit = await get_outfit_by_id(db, outfit_id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    await get_user_profile(outfit.profile_id, current_user, db)
    try:
        outfit = await update_outfit(
            db,
            outfit,
            name=data.name,
            occasion=data.occasion,
            season=data.season.value if data.season else None,
            clothing_ids=data.clothing_ids,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return to_outfit_response(outfit)


@router.delete("/{outfit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_outfit(
    outfit_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    outfit = await get_outfit_by_id(db, outfit_id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    await get_user_profile(outfit.profile_id, current_user, db)
    await delete_outfit(db, outfit)
