<div align="center">

# 📄 PDFCraft

### Premium PDF & document tools — 25 quality features, zero signup walls

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=flat-square&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PyMuPDF](https://img.shields.io/badge/PyMuPDF-1.27-FF6B6B?style=flat-square)](https://pymupdf.readthedocs.io)

**[Live Demo](#) · [Features](#-features) · [Quick Start](#-quick-start) · [API](#-api-reference) · [Roadmap](#-roadmap)**

</div>

---

## ✨ What makes PDFCraft different

PDFCraft is a **production-grade, quality-first** PDF & document toolkit. Every tool is hand-picked and actually works — we deliberately removed features that couldn't meet our quality bar (like HTML→PDF without a proper Chromium engine).

| | PDFCraft | iLovePDF | SmallPDF | Adobe |
|---|:---:|:---:|:---:|:---:|
| **Preview before download** | ✅ | ❌ | ❌ | ⚠️ |
| **QR scan to mobile** | ✅ | ❌ | ❌ | ❌ |
| **3 PDF→PPT modes** (Image/Searchable/Editable) | ✅ | ⚠️ | ⚠️ | ✅ |
| **No signup required** | ✅ | ⚠️ | ⚠️ | ❌ |
| **Files auto-deleted (15 min)** | ✅ | ✅ | ✅ | ✅ |
| **Open-source / self-hostable** | ✅ | ❌ | ❌ | ❌ |
| **No ads, ever** | ✅ | ❌ | ⚠️ | ✅ |

---

## 🎯 Features

### 🛠 PDF Tools (9)
Merge · Split · Compress · Rotate · Reorder · Extract · Watermark · Edit (full PDF editor) · OCR

### 📤 Convert from PDF (6)
PDF → Word · Excel · PowerPoint · Image · Text · CSV

### 📥 Convert to PDF (6)
Word · Excel · PowerPoint · Image · Text · CSV → PDF

### 🖼 Word & Image utilities (4)
Word → Image · Word → Text · Image Format Converter · Image Compress

**Total: 25 tools** — each tested end-to-end, every one production-ready.

### 🌟 Flagship features

- **🔍 Preview before download** — See the exact output with slide thumbnails + metadata before committing. Not right? Change options without re-uploading.
- **📱 QR scan to mobile** — Every download generates a QR code. Scan with your phone to continue on another device.
- **🎨 3 PDF→PPT modes:**
  - **Pixel-Perfect** — crisp high-res image per slide
  - **Searchable** — image + invisible text layer (Ctrl+F works)
  - **Editable** — native PowerPoint text, shapes, and images
- **🔐 Privacy-first** — 256-bit SSL + auto-delete in 15 min + GDPR ready + zero third-party tracking
- **⚡ Token-based downloads** — time-limited URLs for safe sharing

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- Redis (optional, for Celery async tasks)

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements/development.txt

# Configure environment
cp .env.example .env
# Edit .env — set DJANGO_SECRET_KEY

# Run migrations
python manage.py migrate

# Start dev server
python manage.py runserver
```
Backend runs at **http://localhost:8000**

### Frontend

```bash
cd frontend

npm install
npm run dev
```
Frontend runs at **http://localhost:5173**

### First run

1. Open http://localhost:5173
2. Drop a PDF onto any tool
3. Preview the output
4. Download or scan to mobile

---

## 📁 Project Structure

```
pdfcraft/
├── backend/                      # Django 5 REST API
│   ├── apps/
│   │   ├── accounts/              # Auth (JWT)
│   │   ├── documents/             # Upload & storage
│   │   │   └── management/commands/
│   │   │       └── cleanup_uploads.py   # Auto-cleanup cron
│   │   ├── editor/                # Canvas / fabric editing
│   │   ├── tools/                 # Merge / split / compress / etc.
│   │   └── conversions/           # PDF ↔ Office / Image
│   │       └── services/          # Pure conversion functions
│   ├── common/
│   │   └── preview.py             # Shared preview-flow helpers
│   └── pdfcraft/settings/         # dev / prod config
│
├── frontend/                     # Vite + React 19
│   └── src/
│       ├── api/                   # Axios clients
│       ├── components/
│       │   ├── common/
│       │   │   └── PreviewModal.tsx   # Reusable preview with QR
│       │   ├── conversions/
│       │   ├── editor/
│       │   ├── layout/
│       │   └── tools/
│       ├── pages/                 # HomePage, Features, Compare, About...
│       └── store/                 # Zustand stores
│
└── README.md
```

---

## 🏗 Tech Stack

| Layer | Tech |
|---|---|
| **PDF engine** | PyMuPDF (`fitz`) |
| **Office conversion** | python-docx · python-pptx · openpyxl |
| **Image processing** | Pillow |
| **OCR** | Tesseract (optional) |
| **Backend** | Django 5 · DRF · Celery · Redis |
| **Frontend** | React 19 · Vite · TailwindCSS 4 · Zustand · React Router 7 |
| **Editor** | Fabric.js + pdf.js |
| **Auth** | JWT (SimpleJWT) |

---

## 🔌 API Reference

All endpoints under `/api/v1/` — full list: `/api/v1/convert/`, `/api/v1/tools/`, `/api/v1/documents/`.

### Upload a document
```http
POST /api/v1/documents/upload/
Content-Type: multipart/form-data
→ { "id": "uuid", "page_count": 5, "file_size": 1234567 }
```

### Convert with preview
```http
POST /api/v1/convert/pdf-to-ppt/
Content-Type: application/json

{
  "document_id": "uuid",
  "mode": "image",          // "image" | "searchable" (hybrid) | "editable"
  "dpi": 250,
  "preview": true           // ← key: returns JSON instead of streaming file
}

→ {
    "token": "abc123...",
    "download_url": "/api/v1/convert/download/abc123/",
    "filename": "my_doc.pptx",
    "file_size": 72203,
    "page_count": 5,
    "expires_in": 900,
    "preview_pages": [
      { "index": 1, "thumbnail_url": "...", "preview_url": "..." }
    ]
  }
```

### Direct download (no preview)
Omit `preview: true` — endpoint streams the file directly as an attachment.

### Download by token
```http
GET /api/v1/convert/download/{token}/
→ binary file stream
```

### Preview page image
```http
GET /api/v1/convert/preview/{token}/{page_num}/?dpi=120
→ image/png
```

**Tokens expire 15 minutes after creation.** Files are wiped server-side when the token expires.

---

## 🔐 Privacy & Security

- **Files auto-deleted** within 15 minutes of token expiry (or 24 hours max, whichever comes first)
- **256-bit SSL** end-to-end
- **No third-party tracking** — no Google Analytics, no pixels, no ads
- **GDPR & CCPA compliant** — full data export + deletion on request
- **Session-isolated storage** — your files are never visible to other users

Run the cleanup cron to enforce retention:
```bash
# Every hour, delete files older than 24h
0 * * * * cd /path/to/backend && python manage.py cleanup_uploads --hours 24
```

---

## 🧪 Testing

```bash
# Backend smoke tests (all 25 tool endpoints)
cd backend
python manage.py test

# Frontend TypeScript check
cd frontend
npx tsc -b --noEmit
```

---

## 🗺 Roadmap

### Near term
- [ ] Dark mode toggle
- [ ] Visual page picker (thumbnail-based split/extract/merge)
- [ ] Password protect / unlock PDF *(properly, with pikepdf)*
- [ ] Real-time progress bar for large files (Celery + SSE)
- [ ] Batch processing — multi-file upload
- [ ] PDF annotations & highlights in editor

### Mid term
- [ ] Dockerized deployment
- [ ] User accounts with file history
- [ ] Razorpay / UPI integration for Pro tier
- [ ] OpenAPI / Swagger docs
- [ ] Playwright E2E tests

### Deliberately not shipping
- ❌ **HTML ↔ PDF** (needs a real Chromium engine to meet quality bar)
- ❌ **Basic Word → HTML** (output is too lossy to be useful)

> **Quality, not quantity.** We'd rather ship 25 tools that work perfectly than 50 that work "okay."

---

## 🤝 Contributing

Contributions welcome! A few guidelines:

1. **Quality first** — we reject features that produce poor-quality output, even if they work
2. **Tests required** — new tools need backend unit tests + end-to-end verification
3. **Preview flow** — all new generating endpoints should support `preview=true`
4. **No ads / trackers** — PDFCraft stays ad-free and privacy-first

Open an issue before large changes so we can discuss approach.

---

## 📄 License

MIT License © 2026 PDFCraft

---

<div align="center">

**Built with care for people who care about their documents.**

[Features](#-features) · [Quick Start](#-quick-start) · [API](#-api-reference) · [Privacy](#-privacy--security) · [Contribute](#-contributing)

</div>
