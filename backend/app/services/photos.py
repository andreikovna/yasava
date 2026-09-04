import shutil
import uuid
from io import BytesIO
from pathlib import Path

from fastapi import UploadFile
from PIL import Image

import pillow_heif

from app.config import settings

pillow_heif.register_heif_opener()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}
HEIC_EXTENSIONS = {".heic", ".heif"}
HEIC_CONTENT_TYPES = {"image/heic", "image/heif", "image/heic-sequence"}


def _is_heic(filename: str, content_type: str | None) -> bool:
    ext = Path(filename).suffix.lower()
    return ext in HEIC_EXTENSIONS or (content_type or "").lower() in HEIC_CONTENT_TYPES


def _validate_image(filename: str, content_type: str | None) -> None:
    if _is_heic(filename, content_type):
        return
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise ValueError(
            f"File type {ext or content_type or 'unknown'} not allowed. Use: {allowed}"
        )


def _heic_to_jpeg(data: bytes, dest: Path) -> None:
    image = Image.open(BytesIO(data))
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")
    image.save(dest, format="JPEG", quality=90)


def _upload_dir() -> Path:
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


async def save_photo(file: UploadFile, profile_id: uuid.UUID) -> str:
    filename = file.filename or "photo.jpg"
    _validate_image(filename, file.content_type)

    stem = f"{profile_id}_{uuid.uuid4().hex}"
    upload_dir = _upload_dir()

    if _is_heic(filename, file.content_type):
        file_name = f"{stem}.jpg"
        _heic_to_jpeg(await file.read(), upload_dir / file_name)
        return file_name

    ext = Path(filename).suffix.lower()
    file_name = f"{stem}{ext}"
    with open(upload_dir / file_name, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_name


def delete_photo(photo_path: str) -> None:
    path = _upload_dir() / Path(photo_path).name
    if path.exists():
        path.unlink()
