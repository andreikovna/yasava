import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.profile import Profile
from app.models.user import User
from app.schemas.clothes import Category, ClothesResponse, ClothesUpdate, Season
from app.services.clothes import (
    create_clothes,
    delete_clothes,
    get_clothes_by_id,
    get_clothes_by_profile,
    save_photo,
    update_clothes,
)

router = APIRouter(prefix="/clothes", tags=["clothes"])


async def _get_user_profile(
    profile_id: uuid.UUID, user: User, db: AsyncSession
) -> Profile:
    result = await db.execute(
        select(Profile).where(Profile.id == profile_id, Profile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile


@router.post("/", response_model=ClothesResponse, status_code=status.HTTP_201_CREATED)
async def add_clothes(
    profile_id: uuid.UUID = Form(...),
    category: Category = Form(...),
    color: str | None = Form(None),
    season: Season | None = Form(None),
    style: str | None = Form(None),
    photo: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_user_profile(profile_id, current_user, db)

    try:
        photo_filename = await save_photo(photo, profile_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    item = await create_clothes(
        db,
        profile_id=profile_id,
        photo_filename=photo_filename,
        category=category.value,
        color=color,
        season=season.value if season else None,
        style=style,
    )
    item.photo_path = f"/uploads/{item.photo_path}"
    return item


@router.get("/", response_model=list[ClothesResponse])
async def list_clothes(
    profile_id: uuid.UUID = Query(...),
    category: Category | None = Query(None),
    season: Season | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_user_profile(profile_id, current_user, db)
    items = await get_clothes_by_profile(
        db,
        profile_id,
        category=category.value if category else None,
        season=season.value if season else None,
    )
    for item in items:
        item.photo_path = f"/uploads/{item.photo_path}"
    return items


@router.get("/{clothes_id}", response_model=ClothesResponse)
async def get_clothes(
    clothes_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = await get_clothes_by_id(db, clothes_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    await _get_user_profile(item.profile_id, current_user, db)
    item.photo_path = f"/uploads/{item.photo_path}"
    return item


@router.patch("/{clothes_id}", response_model=ClothesResponse)
async def edit_clothes(
    clothes_id: uuid.UUID,
    data: ClothesUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = await get_clothes_by_id(db, clothes_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    await _get_user_profile(item.profile_id, current_user, db)
    item = await update_clothes(
        db,
        item,
        category=data.category.value if data.category else None,
        color=data.color,
        season=data.season.value if data.season else None,
        style=data.style,
    )
    item.photo_path = f"/uploads/{item.photo_path}"
    return item


@router.delete("/{clothes_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_clothes(
    clothes_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = await get_clothes_by_id(db, clothes_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    await _get_user_profile(item.profile_id, current_user, db)
    await delete_clothes(db, item)
