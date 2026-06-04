# TripMind Backend

FastAPI backend for the TripMind AI-powered travel itinerary planner.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.111 |
| Language | Python 3.11 |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy 2.0 (async) |
| DB Driver | asyncpg |
| Vector DB | ChromaDB (placeholder) |
| Migrations | Alembic |
| Config | python-dotenv + pydantic-settings |
| Server | Uvicorn |

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── config.py        # Environment settings (pydantic-settings)
│   │   └── security.py      # Auth utilities (placeholder)
│   ├── db/
│   │   ├── base.py          # SQLAlchemy declarative base
│   │   ├── session.py       # Async engine + session factory
│   │   └── init_db.py       # DB initialization helper
│   ├── models/
│   │   ├── itinerary.py     # Itinerary + DayPlan ORM models
│   │   └── user.py          # User ORM model (placeholder)
│   ├── schemas/
│   │   ├── itinerary.py     # Pydantic request/response schemas
│   │   └── common.py        # Shared schema types
│   ├── routers/
│   │   ├── health.py        # GET /health
│   │   └── itinerary.py     # /api/v1/itinerary routes
│   └── services/
│       └── itinerary.py     # Itinerary business logic
├── alembic/                 # DB migrations
│   └── env.py
├── alembic.ini
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 15+
- pip or [uv](https://github.com/astral-sh/uv) (recommended)

### 2. Create virtual environment

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/tripmind
SECRET_KEY=your-secret-key-here
FRONTEND_ORIGIN=http://localhost:3000
```

### 5. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE tripmind;"
```

### 6. Run database migrations

```bash
alembic upgrade head
```

### 7. Start the development server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health check**: http://localhost:8000/health

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `GET` | `/api/v1/itinerary/{id}` | Get itinerary by ID |
| `POST` | `/api/v1/itinerary` | Create/generate an itinerary |
| `PATCH` | `/api/v1/itinerary/{id}` | Update itinerary |
| `DELETE` | `/api/v1/itinerary/{id}` | Delete itinerary |

## Development

### Linting & formatting

```bash
ruff check .
ruff format .
```

### Running tests

```bash
pytest tests/ -v
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL async connection URL | — |
| `SECRET_KEY` | App secret key for signing | — |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `DEBUG` | Enable debug mode | `false` |
| `API_V1_PREFIX` | API version prefix | `/api/v1` |
| `GEMINI_API_KEY` | Google Gemini API key (future) | — |
| `CHROMA_PERSIST_DIR` | ChromaDB persistence path | `./chroma_data` |
