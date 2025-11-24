from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import os
import uuid
import asyncio
from pydub import AudioSegment
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
    # Placeholder for processing logic
    await asyncio.sleep(2)
    # Create a 1-second silent mp3 using pydub
    silent = AudioSegment.silent(duration=1000)  # 1 second
    silent.export(f"{job_dir}/final.mp3", format="mp3")
    job = Job(job_id=job_id, title="Test", user_id=user.id if user else None)
    db.add(job); db.commit()
    return {"job_id": job_id, "download_url": f"/download/{job_id}"}

@router.get("/download/{job_id}")
def download(job_id: str):
    path = f"outputs/{job_id}/final.mp3"
    if os.path.exists(path):
        return FileResponse(path)
    raise HTTPException(404, "File not found")
