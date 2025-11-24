ListenWise

ListenWise turns YouTube videos and PDFs into narrated audio with AI-powered explanations. This repository contains a FastAPI backend and a Next.js frontend.

Repo layout

listenwise/
├── backend/          # FastAPI backend (Python)
├── frontend/         # Next.js frontend (React + Tailwind)
└── README.md         # This file

Quick start (development)

Prerequisites:
- Python 3.10+ and env
- Node.js 18+/npm

1) Start backend

`powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
`

2) Start frontend

`powershell
cd frontend
npm install
npm run dev
`

Frontend expects NEXT_PUBLIC_API_URL to point at the backend (default http://localhost:8000). Set it in rontend/.env.local.

Backend (high level)

- POST /auth/signup — create user
- POST /auth/login — login, returns JWT
- POST /process — submit a YouTube URL or PDF to process; returns a job id / download url
- GET /download/{job_id} — download generated audio
- GET /admin/stats — admin stats (requires admin credentials)
- GET /jobs/ — list jobs for the authenticated user
- POST /chat — chat endpoint (currently a simple echo; integrate your LLM here)

Authentication: endpoints use a bearer JWT. The backend implements get_current_user (optional) so endpoints may accept anonymous requests or require auth depending on the route.

Frontend

- Uses Next.js (App Router), Tailwind and React.
- src/lib/api.ts uses process.env.NEXT_PUBLIC_API_URL and falls back to http://localhost:8000.

Deployment

- Set the backend environment variables (JWT_SECRET, DATABASE_URL, GROQ_API_KEY, etc.) in your hosting environment.
- Set NEXT_PUBLIC_API_URL in the frontend hosting environment to your backend URL.

Git

To connect this repo to your GitHub remote:

`powershell
git remote add origin https://github.com/EverbestDev/listenwise.git
git branch -M main
git push -u origin main
`

If you want, I can run the git commands for you from this environment (you may need to supply credentials or a token).

