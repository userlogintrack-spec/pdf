# PDFCraft

Full-stack PDF toolkit with a Django REST API backend and a Vite/React frontend.

## Structure

- `backend/` — Django 5 + DRF + Celery
- `frontend/` — Vite + React

## Backend setup

```bash
cd backend
pip install -r requirements/development.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```
