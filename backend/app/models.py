from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Time, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)


class Bus(Base):
    """A scheduled bus service running between two cities on a given date."""

    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    operator_name = Column(String, nullable=False)        # e.g. "Volvo Express"
    from_city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    to_city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    travel_date = Column(Date, nullable=False)
    departure_time = Column(Time, nullable=False)
    arrival_time = Column(Time, nullable=False)
    fare = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())

    from_city = relationship("City", foreign_keys=[from_city_id])
    to_city = relationship("City", foreign_keys=[to_city_id])
    stops = relationship("Stop", back_populates="bus", cascade="all, delete-orphan", order_by="Stop.sequence")


class Stop(Base):
    """An intermediate stop along a bus's route, with arrival time and coordinates."""

    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"), nullable=False)
    name = Column(String, nullable=False)
    sequence = Column(Integer, nullable=False)   # order along the route, 0-indexed
    arrival_time = Column(Time, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    bus = relationship("Bus", back_populates="stops")
