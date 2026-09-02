import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WearLog(Base):
    __tablename__ = "wear_log"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    outfit_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("outfits.id"), nullable=False)
    worn_at: Mapped[date] = mapped_column(Date, nullable=False)

    profile: Mapped["Profile"] = relationship(back_populates="wear_logs")
    outfit: Mapped["Outfit"] = relationship(back_populates="wear_logs")
