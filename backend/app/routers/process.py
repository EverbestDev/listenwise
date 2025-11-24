from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import os
import uuid
import asyncio
import wave
from ..models import Job
from ..database import get_db
from ..auth import get_current_user

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

router = APIRouter(tags=["process"])

@router.post("/process")
async def process(
    youtube_url: str = Form(None),
    pdf_file: UploadFile = File(None),
    voice: str = Form("en-US-AriaNeural"),
    style: str = Form("Like I'm 15"),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)
    # Placeholder for processing logic (simulate work)
    await asyncio.sleep(2)

    # Create a 1-second silent WAV file using only the standard library to avoid
    # importing optional native extensions at module import time (Render issues).
    wav_path = os.path.join(job_dir, "final.wav")
    framerate = 44100
    duration_ms = 1000
    n_frames = int(framerate * (duration_ms / 1000.0))
    sampwidth = 2  # 16-bit
    n_channels = 1

    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(n_channels)
        wf.setsampwidth(sampwidth)
        wf.setframerate(framerate)
        wf.writeframes(b"\x00\x00" * n_frames)

    job = Job(job_id=job_id, title="Test", user_id=user.id if user else None)
    db.add(job); db.commit()
    return {"job_id": job_id, "download_url": f"/download/{job_id}"}

@router.get("/download/{job_id}")
def download(job_id: str):
    # Prefer WAV first, then MP3 if present
    path_wav = f"outputs/{job_id}/final.wav"
    path_mp3 = f"outputs/{job_id}/final.mp3"
    if os.path.exists(path_wav):
        return FileResponse(path_wav)
    if os.path.exists(path_mp3):
        return FileResponse(path_mp3)
    raise HTTPException(404, "File not found")
