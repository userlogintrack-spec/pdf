# Deployment Guide — PDFCraft

Free-tier stack:

| Layer | Service | Cost |
|---|---|---|
| Database | Neon Postgres | Free |
| Backend (Django + DRF) | Render Web Service | Free (sleeps after 15 min idle) |
| Frontend (Vite React) | Vercel | Free |

Celery workers need paid tier on Render — this guide runs the backend without a Celery worker. If you rely on Celery tasks, either move them to synchronous calls or use Railway / Fly.io for the worker.

---

## 1. Prerequisites

- GitHub account with this repo pushed (`main` branch)
- Neon Postgres database created → `DATABASE_URL` copied
- Render account (sign in with GitHub)
- Vercel account (sign in with GitHub)

---

## 2. Backend → Render

### 2.1. Create web service

Dashboard → **New + → Web Service** → connect GitHub repo → pick this repo.

Fill in:

| Field | Value |
|---|---|
| Name | `pdfcraft-backend` (or your choice) |
| Language | Python 3 |
| Branch | `main` |
| Region | closest to your users |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements/base.txt && python manage.py collectstatic --noinput && python manage.py migrate` |
| Start Command | `gunicorn pdfcraft.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
| Instance Type | Free |

Alternative: the repo includes [`render.yaml`](render.yaml) — use **Blueprint** flow to let Render read it.

### 2.2. Environment variables

Add under **Environment** tab:

| Key | Value |
|---|---|
| `DJANGO_SETTINGS_MODULE` | `pdfcraft.settings.production` |
| `DJANGO_SECRET_KEY` | 50-char random string (Generate button works) |
| `PYTHON_VERSION` | `3.11.9` |
| `DATABASE_URL` | your Neon connection string |
| `ALLOWED_HOSTS` | `<service-name>.onrender.com` (no https, no trailing slash) |
| `CORS_ALLOWED_ORIGINS` | your Vercel URL (comma-separated if multiple) |

⚠️ `ALLOWED_HOSTS` must match Render's actual hostname or Django returns `DisallowedHost`.

A ready-to-paste local copy is in `backend/production.env` (gitignored) — use Render's **Add from .env** button to bulk import.

### 2.3. Deploy

Click **Create Web Service**. First build takes 3–5 min. Healthcheck is `/admin/login/` — if it returns 200 the service goes Live.

### 2.4. Verify

- Visit `https://<service>.onrender.com/admin/login/` — Django login page should render.
- Visit `https://<service>.onrender.com/api/v1/documents/` — should return DRF response (login required or JSON list).

---

## 3. Frontend → Vercel

### 3.1. Import project

Dashboard → **Add New → Project** → select this repo.

| Field | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` (default) |
| Output Directory | `dist` (default) |

### 3.2. Environment variables

Settings → **Environment Variables**:

| Key | Value | Scope |
|---|---|---|
| `VITE_API_URL` | `https://<render-service>.onrender.com` | Production, Preview, Development |

### 3.3. Deploy

Click **Deploy**. Vercel builds on every push to `main`. After env var changes, trigger a manual redeploy (Deployments → ⋯ → Redeploy).

### 3.4. Production URL

Settings → **Domains** — use the shortest `<project>.vercel.app` URL as the canonical origin. Preview URLs (e.g. `pdf-he6q-...-projects.vercel.app`) change per deploy and will break CORS unless added to the allow list.

---

## 4. Wire frontend ↔ backend

After both services are live:

1. Copy Vercel production URL → update `CORS_ALLOWED_ORIGINS` in Render.
2. Copy Render service URL → verify `VITE_API_URL` in Vercel.
3. Redeploy whichever side changed.

Smoke test: open the Vercel app, open DevTools → Network, perform any action. API calls should hit `https://<render-service>.onrender.com/...`, not localhost.

---

## 5. Common errors

| Symptom | Cause | Fix |
|---|---|---|
| `DisallowedHost` on Render | `ALLOWED_HOSTS` missing the actual hostname | Add exact `<service>.onrender.com` |
| CORS error in browser | Vercel origin not in `CORS_ALLOWED_ORIGINS` | Add full origin, no trailing `/` |
| Vercel build fails TS6133 (unused) | `noUnusedLocals` in [tsconfig.app.json](frontend/tsconfig.app.json) | Remove unused vars |
| Render build OOM during `pip install` | PyMuPDF / Pillow wheels heavy | Ensure Free plan is enough; retry build cache |
| Frontend calls localhost:8000 in prod | `VITE_API_URL` not set or not redeployed after setting | Add env var + redeploy |
| First request ~30 s slow | Free tier cold start | Expected; upgrade plan to eliminate |

---

## 6. Redeploy cheatsheet

```bash
# Trigger redeploy on both Vercel + Render
git commit --allow-empty -m "trigger redeploy"
git push
```

- Vercel auto-builds on push.
- Render auto-builds on push (Blueprint repos) or on manual deploy.

---

## 7. Secrets hygiene

- `backend/.env` and `backend/production.env` are gitignored — never force-add them.
- If the Neon password leaks, rotate it in the Neon console and update Render.
- `DJANGO_SECRET_KEY` should be unique per environment.
