from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from .database import get_db
from .models import User, Job
from .auth import get_current_user
from .core.config import settings

router = APIRouter(prefix="/admin", tags=["admin"])

async def require_admin(user = Depends(get_current_user)):
    if not user or user.email != settings.ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/stats")
async def stats(db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    total_users = db.query(User).count()
    total_jobs = db.query(Job).count()
    today_jobs = db.query(Job).filter(func.date(Job.created_at) == func.date("now")).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "today_jobs": today_jobs,
        "message": f"Welcome back, Admin {settings.ADMIN_EMAIL.split('@')[0].title()}!"
    }