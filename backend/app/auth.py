from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from .models import User
from .database import get_db
from .core.config import settings

# Fix: Only one bearer + auto_error=False makes it optional
bearer_scheme = HTTPBearer(auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")

# THE ONLY CORRECT get_current_user
async def get_current_user(
    token = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    if not token:
        return None
    try:
        payload = jwt.decode(token.credentials, settings.JWT_SECRET, algorithms=["HS256"])
        email: str = payload.get("sub")
        if not email:
            return None
        user = db.query(User).filter(User.email == email).first()
        return user
    except JWTError:
        return None