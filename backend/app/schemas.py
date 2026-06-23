from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


# ---------- City ----------

class CityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    latitude: float
    longitude: float


# ---------- Stop ----------

class StopBase(BaseModel):
    name: str
    sequence: int
    arrival_time: time
    latitude: float
    longitude: float


class StopOut(StopBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Bus ----------

class BusCreate(BaseModel):
    operator_name: str
    from_city_id: int
    to_city_id: int
    travel_date: date
    departure_time: time
    arrival_time: time
    fare: float = 0
    stops: list[StopBase] = []


class BusListItem(BaseModel):
    """Lightweight shape used for search results / bus list cards."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    operator_name: str
    travel_date: date
    departure_time: time
    arrival_time: time
    fare: float
    from_city: CityOut
    to_city: CityOut


class BusDetail(BusListItem):
    """Full shape used for the bus detail page, includes stops for the map."""
    stops: list[StopOut] = []
