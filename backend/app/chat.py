from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from .auth import get_current_user
from .core.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("/")
async def chat_endpoint(req: ChatRequest, user=Depends(get_current_user)):
    """Simple chat endpoint. Currently echoes the prompt back with a prefix.

    Replace the implementation with a call to your LLM provider (Groq/OpenAI)
    when you have the API key and desired prompt formatting.
    """
    if not req.message:
        raise HTTPException(status_code=400, detail="Empty message")

    # If you have a real model client configured (e.g. Groq), you can call it here.
    # For now we return a quick immediate textual response so the UI feels snappy.
    reply = f"Assistant: {req.message}"

    return {"reply": reply}
