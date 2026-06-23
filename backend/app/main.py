import os
from datetime import date
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from . import models, schemas
from .database import engine, Base, get_db

# Create tables on startup if they don't exist yet (no-op once seeded)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Automated Bus Scheduling System API", version="1.0.0")

# CORS: allow the deployed frontend (Vercel) plus local dev to call this API.
# Set FRONTEND_ORIGIN env var in production to your exact Vercel URL.
frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin] if frontend_origin != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "Automated Bus Scheduling System API"}


@app.get("/cities", response_model=list[schemas.CityOut])
def list_cities(db: Session = Depends(get_db)):
    return db.query(models.City).order_by(models.City.name).all()


@app.get("/buses/search", response_model=list[schemas.BusListItem])
def search_buses(
    from_city: str = Query(..., description="Origin city name"),
    to_city: str = Query(..., description="Destination city name"),
    travel_date: date | None = Query(None, description="Date of travel, defaults to all dates"),
    filter: str = Query("all", pattern="^(all|upcoming|current)$"),
    db: Session = Depends(get_db),
):
    from_obj = db.query(models.City).filter(models.City.name.ilike(from_city)).first()
    to_obj = db.query(models.City).filter(models.City.name.ilike(to_city)).first()
    if not from_obj or not to_obj:
        raise HTTPException(status_code=404, detail="Unknown from/to city")

    q = db.query(models.Bus).options(
        joinedload(models.Bus.from_city), joinedload(models.Bus.to_city)
    ).filter(
        models.Bus.from_city_id == from_obj.id,
        models.Bus.to_city_id == to_obj.id,
    )

    if travel_date:
        q = q.filter(models.Bus.travel_date == travel_date)

    buses = q.order_by(models.Bus.departure_time).all()

    if filter == "upcoming":
        buses = buses[1:] if len(buses) > 1 else []
    elif filter == "current":
        buses = []  # placeholder: "currently en route" requires live tracking, not yet implemented

    return buses


@app.get("/buses/{bus_id}", response_model=schemas.BusDetail)
def get_bus(bus_id: int, db: Session = Depends(get_db)):
    bus = db.query(models.Bus).options(
        joinedload(models.Bus.from_city),
        joinedload(models.Bus.to_city),
        joinedload(models.Bus.stops),
    ).filter(models.Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    return bus


@app.get("/buses/{bus_id}/stops", response_model=list[schemas.StopOut])
def get_bus_stops(bus_id: int, db: Session = Depends(get_db)):
    bus = db.query(models.Bus).filter(models.Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    return bus.stops


@app.post("/buses", response_model=schemas.BusDetail, status_code=201)
def create_bus(payload: schemas.BusCreate, db: Session = Depends(get_db)):
    from_city = db.query(models.City).get(payload.from_city_id)
    to_city = db.query(models.City).get(payload.to_city_id)
    if not from_city or not to_city:
        raise HTTPException(status_code=400, detail="Invalid from_city_id or to_city_id")

    bus = models.Bus(
        operator_name=payload.operator_name,
        from_city_id=payload.from_city_id,
        to_city_id=payload.to_city_id,
        travel_date=payload.travel_date,
        departure_time=payload.departure_time,
        arrival_time=payload.arrival_time,
        fare=payload.fare,
    )
    db.add(bus)
    db.flush()

    for s in payload.stops:
        db.add(models.Stop(bus_id=bus.id, **s.model_dump()))

    db.commit()
    db.refresh(bus)
    return bus
