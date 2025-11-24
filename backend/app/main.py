from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .admin import router as admin_router
from .jobs import router as jobs_router
from .chat import router as chat_router
from .routers.auth import router as auth_router
from .routers.process import router as process_router

app = FastAPI(title="ListenWise API")
app.include_router(admin_router)
app.include_router(jobs_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(process_router)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup():
    init_db()