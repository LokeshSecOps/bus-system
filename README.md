# RouteWise — Automated Bus Scheduling System

A web-based intercity bus scheduling platform. Search buses between cities, view
departure/arrival times and fares, and see the planned route on an interactive map.

This is the working implementation of the project documented in the accompanying
B.Tech project report. It extends the report's frontend stack with a real Python
backend and database (see "Deviations from the report" below).

## Stack

**Frontend** — React 19, Next.js 15, Tailwind CSS 4, React Icons, Leaflet / React-Leaflet
**Backend** — Python, FastAPI, SQLAlchemy, Pydantic
**Database** — PostgreSQL (production) / SQLite (local dev fallback)

## Project structure

```
bus-system/
├── backend/           FastAPI app
│   ├── app/
│   │   ├── main.py        API routes
│   │   ├── models.py      SQLAlchemy models (City, Bus, Stop)
│   │   ├── schemas.py     Pydantic request/response schemas
│   │   ├── database.py    DB connection/session setup
│   │   └── seed.py        Sample data loader
│   ├── requirements.txt
│   └── Procfile           Render/Railway start command
│
└── frontend/           Next.js app
    ├── app/
    │   ├── page.js             Welcome page
    │   ├── buslist/page.js     Search + results
    │   ├── bus/[id]/page.js    Bus detail + route map
    │   └── bus-form/page.js    Add a schedule
    ├── components/
    │   ├── SearchForm.jsx
    │   ├── BusCard.jsx
    │   ├── BusListClient.jsx
    │   ├── BusMap.jsx          Leaflet map
    │   ├── BusRoute.jsx        Map + stops controller
    │   └── BusForm.jsx
    └── lib/api.js               Backend API client
```

## Running locally

### Backend

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python -m app.seed        # one-time: populate sample data
./venv/bin/uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

By default this uses a local SQLite file (`bus_system.db`) so it runs with zero
extra setup. To use Postgres locally instead, set `DATABASE_URL` before running
(see `.env.example`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`. The frontend reads the backend URL from
`NEXT_PUBLIC_API_URL` (see `.env.local`, defaults to `http://localhost:8000`).

## Deployment

### Backend → Render or Railway

1. Push the `backend/` folder to a Git repo (or connect the monorepo and set the
   service's root directory to `backend/`).
2. Create a PostgreSQL database on the same platform and copy its connection string.
3. Create a new Web Service from the repo:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (already in `Procfile`)
4. Set environment variables:
   - `DATABASE_URL` → your Postgres connection string
   - `FRONTEND_ORIGIN` → your Vercel URL once deployed (e.g. `https://routewise.vercel.app`)
5. After first deploy, run the seed script once via the platform's shell/console:
   `python -m app.seed`

### Frontend → Vercel

1. Push the `frontend/` folder to a Git repo (or set root directory to `frontend/`
   in a monorepo import).
2. Import the repo in Vercel — it auto-detects Next.js.
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` → your deployed backend URL (e.g. `https://routewise-api.onrender.com`)
4. Deploy.

Once both are live, update the backend's `FRONTEND_ORIGIN` to the final Vercel URL
and redeploy the backend so CORS allows requests from it.

## API overview

| Method | Endpoint                | Description                              |
|--------|--------------------------|-------------------------------------------|
| GET    | `/cities`                | List all cities                          |
| GET    | `/buses/search`          | Search buses by from/to city, date, filter (`all`/`upcoming`/`current`) |
| GET    | `/buses/{id}`            | Full bus detail including stops          |
| GET    | `/buses/{id}/stops`      | Stops for a bus                          |
| POST   | `/buses`                 | Create a new bus schedule                |

Full interactive docs at `/docs` (Swagger UI) once the backend is running.

## Deviations from the report

The submitted report documents a static-data frontend with no backend. This build
adds a Python (FastAPI) backend and PostgreSQL database in place of static JSON,
fulfilling the report's own stated "future scope" of connecting to a real API/database.
Everything else (React, Next.js, Tailwind, Leaflet, component structure, page routes)
matches the report as written.

Two small, justified deviations from exact version numbers in the report:
- **Next.js** was upgraded from 15.3.0 to 15.5.19 (latest patch in active support) to
  fix multiple disclosed security vulnerabilities in 15.3.0–15.4.x.
- Fonts are served via system font stacks rather than `next/font/google`, for
  reliability in network-restricted build environments; visual character (geometric
  sans display, humanist sans body, monospace for times/fares) is preserved.
