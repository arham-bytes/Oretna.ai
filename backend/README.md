# Kaetle AI Research Platform — Backend Service

A dedicated Node.js and Express backend service powering Kaetle's evidence-grounded AI research workspace and authentication.

## Features
- **Authentication**: Secure password hashing (`crypto.scryptSync`), salt generation, session tokens, and HTTP-only cookies.
- **Session Verification**: Cookie-based persistent session inspection for protected research workspace.
- **Research Engine**: Synthesizes structured topics, literature decomposition, and academic DOI-backed sources.
- **Zero Heavy Setup**: Persistent JSON database engine in `data/` directory.

## Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/signup` — Create a new researcher account (`firstName`, `lastName`, `email`, `password`)
- `POST /api/auth/login` — Authenticate researcher credentials
- `GET /api/auth/me` — Inspect current session from cookie
- `POST /api/auth/logout` — Revoke session and clear cookie

### Research (`/api/research`)
- `POST /api/research/query` — Process inquiries from the landing page search box or research cards

### Health
- `GET /health` — Service health check

## Running Locally

```bash
cd backend
npm install
npm run dev   # Runs on http://localhost:5000 with auto-reload
```
