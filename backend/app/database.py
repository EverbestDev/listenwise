from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .core.config import settings
import os

# Fall back to a local SQLite DB file if DATABASE_URL is not specified.
db_url = settings.DATABASE_URL or "sqlite:///./data/listenwise.db"

if db_url.startswith("sqlite"):
    os.makedirs("data", exist_ok=True)

engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from .models import Base
    Base.metadata.create_all(bind=engine)