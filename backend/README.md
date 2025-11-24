# ListenWise — Backend

This folder contains the FastAPI backend for ListenWise.

Quick start (dev):

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Important files:
- `app/main.py` — FastAPI application and route registration
- `app/database.py` — SQLAlchemy engine and session
- `app/models.py` — DB models (User, Job)
- `app/auth.py` — auth helpers (token creation, password hashing)
- `app/jobs.py` — user job history endpoints
- `app/chat.py` — lightweight chat endpoint (replace with LLM integration)

Environment (.env):
- `JWT_SECRET` — secret for signing JWTs
- `DATABASE_URL` — SQLAlchemy DB URL (sqlite or other)
- `GROQ_API_KEY` — (optional) for Groq model usage
- `ADMIN_EMAIL` — admin user email for admin routes

API endpoints (high level):
- `POST /auth/signup`
- `POST /auth/login`
- `POST /process`
- `GET /download/{job_id}`
- `GET /jobs/`
- `POST /chat` (simple echo by default)

Replace the `chat` implementation with your LLM API call for production behavior.