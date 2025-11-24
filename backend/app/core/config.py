import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    JWT_SECRET = os.getenv("JWT_SECRET")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
    DATABASE_URL = os.getenv("DATABASE_URL")

settings = Settings()