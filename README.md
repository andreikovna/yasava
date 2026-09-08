# Yasava — Digital Wardrobe

A mobile app to manage your wardrobe, create outfits, and plan what to wear.

## Tech Stack

- **Mobile**: Expo (React Native) + TypeScript + Zustand
- **Backend**: FastAPI (Python) + SQLAlchemy + Alembic
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Python 3.11+
- Docker (for PostgreSQL)
- Node.js 18+ (for mobile app)

### Backend

```bash
# Start PostgreSQL
docker compose up -d

# Create virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

API docs available at http://localhost:8000/docs

### Mobile

Expo SDK 54 (opens in the App Store / Play Store Expo Go).

```bash
cd mobile
npm install
npx expo start
```

On a physical device the app infers the API host from Metro. To override it, copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL`.
