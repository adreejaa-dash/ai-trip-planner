# TripPlanner — AI-Powered Travel Itinerary Planner

A full-stack web application that generates personalized, day-wise travel itineraries based on destination, trip duration, budget, and user interests. Powered by Google Gemini AI.

## Features

- **Personalized Itinerary Generation** — AI creates structured, day-wise plans tailored to your preferences
- **Budget-Aware Planning** — Set a specific budget and get a detailed breakdown (accommodation, food, transport, activities, miscellaneous) that stays within your limit
- **Interest-Based Personalization** — Select interests like History, Food, Culture, Adventure, Nature, etc. to shape your itinerary
- **Day-Wise Activities** — Each day includes timed activities with real places, descriptions, and estimated costs
- **AI-Generated Travel Tips** — Destination-specific practical tips (not generic filler)
- **Persistent Trip Storage** — Itineraries are saved to PostgreSQL and survive page refreshes
- **Trip Retrieval** — View all your previously generated trips and revisit any itinerary
- **Interactive Itinerary Refinement** — Tell the AI to modify your itinerary: "add more food places", "make Day 2 cheaper", "remove museums"

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python, Pydantic |
| Database | PostgreSQL, SQLAlchemy (async), Alembic |
| AI | Google Gemini API |
| API | RESTful endpoints |

## Architecture

```
Next.js Frontend
       ↓
  REST API calls
       ↓
FastAPI Backend
       ↓
  Trip/Itinerary Service
       ↓
  Google Gemini API
       ↓
  Structured JSON itinerary
       ↓
  Pydantic validation
       ↓
  PostgreSQL storage
       ↓
  JSON response → Frontend UI
```

### Refinement Flow

```
Existing itinerary (from DB)
         +
User refinement instruction
         ↓
    FastAPI endpoint
         ↓
    Gemini API (with context)
         ↓
    Validated updated itinerary
         ↓
    PostgreSQL (updated in place)
         ↓
    Frontend (refreshed)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/trips/generate` | Generate a new trip itinerary |
| `GET` | `/api/trips` | List all saved trips |
| `GET` | `/api/trips/{trip_id}` | Get a complete trip by ID |
| `POST` | `/api/trips/{trip_id}/refine` | Refine an existing trip |

### Example: Generate a Trip

```bash
curl -X POST http://localhost:8000/api/trips/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Bhubaneswar",
    "duration": 3,
    "budget": 10000,
    "currency": "INR",
    "interests": ["history", "food", "culture"]
  }'
```

### Example: Refine a Trip

```bash
curl -X POST http://localhost:8000/api/trips/{trip_id}/refine \
  -H "Content-Type: application/json" \
  -d '{
    "instruction": "Remove museums and add more outdoor activities"
  }'
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and Gemini API key

# Create the database
createdb tripplanner  # Or use psql: CREATE DATABASE tripplanner;

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:password@localhost:5432/tripplanner` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.5-flash` |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` |
| `DEBUG` | Enable debug mode | `true` |

## Project Structure

```
ai-trip-planner/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py          # Environment configuration
│   │   ├── db/
│   │   │   ├── base.py            # SQLAlchemy base + mixins
│   │   │   ├── init_db.py         # DB initialization
│   │   │   └── session.py         # Async session factory
│   │   ├── models/
│   │   │   └── itinerary.py       # Trip SQLAlchemy model
│   │   ├── routers/
│   │   │   ├── health.py          # Health check endpoints
│   │   │   └── trips.py           # Trip CRUD + generation endpoints
│   │   ├── schemas/
│   │   │   └── itinerary.py       # Pydantic request/response schemas
│   │   ├── services/
│   │   │   └── gemini_service.py   # Gemini AI integration
│   │   └── main.py                # FastAPI app entry point
│   ├── alembic/                   # Database migrations
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── plan/page.tsx          # Trip creation form
│   │   ├── itinerary/             # Itinerary display
│   │   ├── trips/page.tsx         # Saved trips list
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── trip/
│   │       ├── ItineraryHeader.tsx
│   │       ├── DayTimeline.tsx
│   │       ├── BudgetBreakdown.tsx
│   │       ├── TravelTips.tsx
│   │       ├── RefinementPanel.tsx
│   │       └── GeneratingState.tsx
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   └── types.ts               # TypeScript types
│   └── package.json
└── README.md
```
