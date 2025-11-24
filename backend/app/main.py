from fastapi import FastAPI, Depends, Form, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uuid
import asyncio
import yt_dlp
import PyPDF2
import io
import edge_tts
from pydub import AudioSegment
from groq import Groq
from sqlalchemy.orm import Session
from .database import get_db, init_db
from .models import User, Job
from .auth import hash_password, create_token, get_current_user
from .admin import router as admin_router
from .jobs import router as jobs_router
from .chat import router as chat_router
from .core.config import settings
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"])

app = FastAPI(title="ListenWise API")
app.include_router(admin_router)
app.include_router(jobs_router)
app.include_router(chat_router)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

client = Groq(api_key=settings.GROQ_API_KEY)
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs("data", exist_ok=True)

@app.on_event("startup")
def startup():
    init_db()

@app.post("/auth/signup")
def signup(email: str = Form(), password: str = Form(), name: str = Form(), db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(400, "Email exists")
    user = User(email=email, name=name, hashed_password=hash_password(password))
    db.add(user); db.commit(); db.refresh(user)
    return {"msg": "Created"}

@app.post("/auth/login")
def login(email: str = Form(), password: str = Form(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(401, "Wrong credentials")
    return {"access_token": create_token({"sub": email}), "name": user.name}

@app.post("/process")
async def process(
    youtube_url: str = Form(None),
    pdf_file: UploadFile = File(None),
    voice: str = Form("en-US-AriaNeural"),
    style: str = Form("Like I'm 15"),
    user=Depends(get_current_user),  # ← Clean and optional
    db: Session = Depends(get_db)
):
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)
    # ... (same processing logic as before — I'll paste full in next message if needed)
    # For now: placeholder
    await asyncio.sleep(2)
    open(f"{job_dir}/final.mp3", "w").close()
    job = Job(job_id=job_id, title="Test", user_id=user.id if user else None)
    db.add(job); db.commit()
    return {"job_id": job_id, "download_url": f"/download/{job_id}"}

@app.get("/download/{job_id}")
def download(job_id: str):
    path = f"outputs/{job_id}/final.mp3"
    return FileResponse(path) if os.path.exists(path) else HTTPException(404)