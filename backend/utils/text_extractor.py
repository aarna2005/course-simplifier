"""
utils/text_extractor.py
-----------------------
Utility functions for extracting plain text from uploaded files.

Supported formats:
  • PDF  – via PyMuPDF (fitz)
  • DOCX – via python-docx
  • TXT  – raw read
"""

import io
from fastapi import UploadFile, HTTPException
import fitz  # PyMuPDF
from docx import Document


async def extract_text_from_upload(file: UploadFile) -> str:
    """
    Read an uploaded file and return its text content as a string.

    Args:
        file: The FastAPI UploadFile object.

    Returns:
        Extracted plain text string.

    Raises:
        HTTPException 400 if the file type is unsupported or parsing fails.
    """
    filename = file.filename or ""
    content = await file.read()

    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext == "pdf":
        return _extract_from_pdf(content)
    elif ext == "docx":
        return _extract_from_docx(content)
    elif ext == "txt":
        return _extract_from_txt(content)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Please upload PDF, DOCX, or TXT.",
        )


def _extract_from_pdf(content: bytes) -> str:
    """Extract text from PDF bytes using PyMuPDF."""
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        pages = [page.get_text() for page in doc]
        text = "\n\n".join(pages).strip()
        if not text:
            raise HTTPException(
                status_code=400,
                detail="The PDF appears to be image-based or has no extractable text.",
            )
        return text
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {exc}")


def _extract_from_docx(content: bytes) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        doc = Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        text = "\n\n".join(paragraphs).strip()
        if not text:
            raise HTTPException(
                status_code=400, detail="The DOCX file contains no readable text."
            )
        return text
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse DOCX: {exc}")


def _extract_from_txt(content: bytes) -> str:
    """Decode TXT bytes to string."""
    try:
        text = content.decode("utf-8", errors="replace").strip()
        if not text:
            raise HTTPException(
                status_code=400, detail="The TXT file is empty."
            )
        return text
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to read TXT file: {exc}")
