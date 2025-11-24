from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Job
from .auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("/")
async def list_jobs(user = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    jobs = db.query(Job).filter(Job.user_id == user.id).order_by(Job.created_at.desc()).all()
    return [
        {
            "job_id": j.job_id,
            "title": j.title,
            "status": j.status,
            "created_at": j.created_at.isoformat() if j.created_at else None,
        }
        for j in jobs
    ]

@router.get("/{job_id}")
async def get_job(job_id: str, user = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    job = db.query(Job).filter(Job.job_id == job_id, Job.user_id == user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "job_id": job.job_id,
        "title": job.title,
        "status": job.status,
        "created_at": job.created_at.isoformat() if job.created_at else None,
    }
