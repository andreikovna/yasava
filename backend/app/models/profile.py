import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500))

    user: Mapped["User"] = relationship(back_populates="profiles")
    clothes: Mapped[list["Clothes"]] = relationship(back_populates="profile", cascade="all, delete-orphan")
    outfits: Mapped[list["Outfit"]] = relationship(back_populates="profile", cascade="all, delete-orphan")
    wear_logs: Mapped[list["WearLog"]] = relationship(back_populates="profile", cascade="all, delete-orphan")
