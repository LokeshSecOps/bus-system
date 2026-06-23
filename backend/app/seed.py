"""
Run this once to populate the database with sample data:
    python -m app.seed
"""
from datetime import date, time, timedelta
from .database import SessionLocal, engine, Base
from . import models

# Real-world coordinates for the cities used throughout the report
CITIES = [
    {"name": "Delhi", "latitude": 28.6139, "longitude": 77.2090},
    {"name": "Gurgaon", "latitude": 28.4595, "longitude": 77.0266},
    {"name": "Mumbai", "latitude": 19.0760, "longitude": 72.8777},
    {"name": "Bangalore", "latitude": 12.9716, "longitude": 77.5946},
    {"name": "Chennai", "latitude": 13.0827, "longitude": 80.2707},
]

# Sample stops between Delhi -> Gurgaon (matches the report's figures:
# Kashmiri Gate, AIIMS, IFFCO Chowk)
DELHI_GURGAON_STOPS = [
    {"name": "Kashmiri Gate", "sequence": 0, "arrival_time": time(8, 0), "latitude": 28.6667, "longitude": 77.2280},
    {"name": "AIIMS", "sequence": 1, "arrival_time": time(8, 30), "latitude": 28.5672, "longitude": 77.2100},
    {"name": "IFFCO Chowk", "sequence": 2, "arrival_time": time(9, 0), "latitude": 28.4720, "longitude": 77.0710},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.City).count() > 0:
            print("Database already seeded. Skipping.")
            return

        # Create cities
        city_objs = {}
        for c in CITIES:
            city = models.City(**c)
            db.add(city)
            city_objs[c["name"]] = city
        db.flush()  # assign IDs without committing yet

        today = date.today()
        tomorrow = today + timedelta(days=1)

        sample_buses = [
            {
                "operator_name": "Volvo Express",
                "from_city": "Delhi", "to_city": "Gurgaon",
                "travel_date": today,
                "departure_time": time(9, 0), "arrival_time": time(13, 0),
                "fare": 450.0,
                "stops": DELHI_GURGAON_STOPS,
            },
            {
                "operator_name": "SuperFast Travels",
                "from_city": "Delhi", "to_city": "Gurgaon",
                "travel_date": today,
                "departure_time": time(11, 0), "arrival_time": time(15, 0),
                "fare": 400.0,
                "stops": DELHI_GURGAON_STOPS,
            },
            {
                "operator_name": "Comfort Ride",
                "from_city": "Delhi", "to_city": "Gurgaon",
                "travel_date": tomorrow,
                "departure_time": time(18, 0), "arrival_time": time(22, 0),
                "fare": 500.0,
                "stops": DELHI_GURGAON_STOPS,
            },
            {
                "operator_name": "Sharma Travels",
                "from_city": "Delhi", "to_city": "Mumbai",
                "travel_date": today,
                "departure_time": time(20, 0), "arrival_time": time(14, 0),
                "fare": 1800.0,
                "stops": [
                    {"name": "Jaipur", "sequence": 0, "arrival_time": time(23, 30), "latitude": 26.9124, "longitude": 75.7873},
                    {"name": "Udaipur", "sequence": 1, "arrival_time": time(4, 0), "latitude": 24.5854, "longitude": 73.7125},
                ],
            },
            {
                "operator_name": "South Express",
                "from_city": "Bangalore", "to_city": "Chennai",
                "travel_date": today,
                "departure_time": time(7, 0), "arrival_time": time(13, 0),
                "fare": 750.0,
                "stops": [
                    {"name": "Vellore", "sequence": 0, "arrival_time": time(11, 0), "latitude": 12.9165, "longitude": 79.1325},
                ],
            },
            {
                "operator_name": "Royal Cruiser",
                "from_city": "Mumbai", "to_city": "Bangalore",
                "travel_date": tomorrow,
                "departure_time": time(21, 0), "arrival_time": time(11, 0),
                "fare": 1600.0,
                "stops": [
                    {"name": "Pune", "sequence": 0, "arrival_time": time(23, 30), "latitude": 18.5204, "longitude": 73.8567},
                    {"name": "Belgaum", "sequence": 1, "arrival_time": time(5, 0), "latitude": 15.8497, "longitude": 74.4977},
                ],
            },
        ]

        for b in sample_buses:
            bus = models.Bus(
                operator_name=b["operator_name"],
                from_city_id=city_objs[b["from_city"]].id,
                to_city_id=city_objs[b["to_city"]].id,
                travel_date=b["travel_date"],
                departure_time=b["departure_time"],
                arrival_time=b["arrival_time"],
                fare=b["fare"],
            )
            db.add(bus)
            db.flush()
            for s in b["stops"]:
                db.add(models.Stop(bus_id=bus.id, **s))

        db.commit()
        print(f"Seeded {len(CITIES)} cities and {len(sample_buses)} buses.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
