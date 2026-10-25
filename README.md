# Oretna.ai — AI Research Assistant (Pre-Launch)

> **Every question opens a world of ideas.**  
> Oretna.ai is an intelligent research assistant built for deep exploration, literature review, citation analysis, and structured academic inquiry.

---

## 🚀 Pre-Launch Architecture

During our pre-launch phase:
- **Public Landing Page**: Explore features, showcase, and early access registration.
- **Authentication**: Secure account signup and login powered by **Neon Serverless PostgreSQL**.
- **Onboarding Survey**: User research survey powered by Google Forms to prioritize features.
- **Access Guarding**: AI research assistant workspace (`/workspace`) is restricted to verified early-access participants.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS v4 & custom design tokens
- **Typography**: Editorial Serif + Clean Sans-serif

### Backend
- **Framework**: [Express.js](https://expressjs.com/) on Node.js v24 (ES Modules)
- **Database**: [Neon](https://neon.tech/) Serverless PostgreSQL over HTTPS (`@neondatabase/serverless`)
- **Authentication**: Session cookies (`oretna_session`), SHA-256 password salting & hashing, token-based password reset
- **Route Guards**: Server-side Next.js middleware and Express guards

### Integrations
- **Google Forms**: User research survey
- **Google Sheets & Apps Script**: Automated webhook verification (`/api/survey/webhook`)
- **Instagram**: [@oretna.ai](https://www.instagram.com/oretna.ai/)

---

## 📂 Project Structure

```text
oretna.ai/
├── frontend/               # Next.js 16 web application
│   ├── src/
│   │   ├── app/            # App Router pages (/login, /signup, /onboarding, /workspace)
│   │   ├── components/     # UI components & design system
│   │   ├── middleware.ts   # Server-side route proxy & protection
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static brand assets & images
│
├── backend/                # Express.js REST API
│   ├── src/
│   │   ├── controllers/    # Auth, survey & research controllers
│   │   ├── db/             # Neon PostgreSQL schema migrations & queries
│   │   ├── middleware/     # Route guards & session validators
│   │   └── routes/         # API endpoints (/api/auth, /api/survey, /api/research)
│   ├── server.js           # Express server entry point
│   └── GOOGLE_SHEETS_APPS_SCRIPT_SETUP.md # Webhook setup guide
└── README.md
```

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+ (v20+ or v24 recommended)
- [Neon](https://neon.tech/) PostgreSQL Database URL

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL, SESSION_SECRET, and SURVEY_WEBHOOK_SECRET in .env
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing

Run the automated pre-launch test suite:
```bash
node backend/test-prelaunch-flow.cjs
```

---

## 📄 License
All rights reserved © 2026 Oretna.ai.
