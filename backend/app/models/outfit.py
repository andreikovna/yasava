import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Outfit(Base):
    __tablename__ = "outfits"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    occasion: Mapped[str | None] = mapped_column(String(100))
    season: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    profile: Mapped["Profile"] = relationship(back_populates="outfits")
    items: Mapped[list["OutfitItem"]] = relationship(back_populates="outfit", cascade="all, delete-orphan")
    wear_logs: Mapped[list["WearLog"]] = relationship(back_populates="outfit", cascade="all, delete-orphan")


class OutfitItem(Base):
    __tablename__ = "outfit_items"

    outfit_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("outfits.id"), primary_key=True)
    clothing_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clothes.id"), primary_key=True)

    outfit: Mapped["Outfit"] = relationship(back_populates="items")
    clothing: Mapped["Clothes"] = relationship(back_populates="outfit_items")
