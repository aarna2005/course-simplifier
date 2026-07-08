"""
routers/upload.py
-----------------
Handles file uploads (PDF / DOCX / TXT).

Endpoint
  POST /upload
    Accepts: multipart/form-data with a 'file' field
    Returns:  { "text": "<extracted content>" }
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from utils.text_extractor import extract_text_from_upload

router = APIRouter(tags=["Upload"])


class UploadResponse(BaseModel):
    text: str
    filename: str
    char_count: int


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF, DOCX, or TXT file and extract its text content.

    Returns the extracted text along with the original filename and
    total character count.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    text = await extract_text_from_upload(file)

    return UploadResponse(
        text=text,
        filename=file.filename,
        char_count=len(text),
    )
