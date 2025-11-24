from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from ..models import User
from ..auth import hash_password, create_token, pwd_context
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(email: str = Form(), password: str = Form(), name: str = Form(), db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(400, "Email exists")
    user = User(email=email, name=name, hashed_password=hash_password(password))
    db.add(user); db.commit(); db.refresh(user)
    return {"msg": "Created"}

@router.post("/login")
def login(email: str = Form(), password: str = Form(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(401, "Wrong credentials")
    return {"access_token": create_token({"sub": email}), "name": user.name}
