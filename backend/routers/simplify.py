"""
routers/simplify.py
-------------------
All AI-powered simplification endpoints.

Endpoints
  POST /simplify   – full pipeline (simplified text + all extras)
  POST /summary    – summary only
  POST /keypoints  – key points only
  POST /flashcards – flashcards only
  POST /quiz       – quiz only
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

from services import watsonx_service

router = APIRouter(tags=["Simplify"])

# ---------------------------------------------------------------------------
# Valid learner levels
# ---------------------------------------------------------------------------
VALID_LEVELS = {
    "beginner",
    "intermediate",
    "high_school",
    "undergraduate",
    "engineering_student",
    "expert",
}

# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class SimplifyRequest(BaseModel):
    text: str
    level: str = "beginner"

    @field_validator("text")
    @classmethod
    def text_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("text must not be empty")
        return v.strip()

    @field_validator("level")
    @classmethod
    def level_must_be_valid(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in VALID_LEVELS:
            raise ValueError(
                f"Invalid level '{v}'. Must be one of: {', '.join(sorted(VALID_LEVELS))}"
            )
        return v


class SimplifyResponse(BaseModel):
    simplified_text: str
    summary: str
    key_points: list[str]
    difficult_terms: list[dict]
    flashcards: list[dict]
    quiz: list[dict]


class SummaryResponse(BaseModel):
    summary: str


class KeyPointsResponse(BaseModel):
    key_points: list[str]


class FlashcardsResponse(BaseModel):
    flashcards: list[dict]


class QuizResponse(BaseModel):
    quiz: list[dict]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _validate_text_and_level(text: str, level: str) -> tuple[str, str]:
    """Shared validation used by individual endpoints."""
    text = text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text must not be empty.")
    level = level.lower().strip()
    if level not in VALID_LEVELS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid level. Must be one of: {', '.join(sorted(VALID_LEVELS))}",
        )
    return text, level


def _watsonx_error_handler(exc: Exception) -> None:
    """Convert IBM SDK / connection errors into readable HTTP responses."""
    msg = str(exc)
    if "401" in msg or "Unauthorized" in msg or "authentication" in msg.lower():
        raise HTTPException(
            status_code=502,
            detail="IBM watsonx.ai authentication failed. Check your API key.",
        )
    if "404" in msg or "not found" in msg.lower():
        raise HTTPException(
            status_code=502,
            detail="IBM watsonx.ai model not found. Check WATSONX_MODEL_ID.",
        )
    raise HTTPException(
        status_code=502,
        detail=f"IBM watsonx.ai API error: {msg}",
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/simplify", response_model=SimplifyResponse)
async def simplify(request: SimplifyRequest):
    """
    Full simplification pipeline.

    Calls IBM watsonx.ai for all 5 outputs in sequence and returns them
    in a single response object.
    """
    text = request.text
    level = request.level

    try:
        simplified = watsonx_service.simplify_content(text, level)
        summary    = watsonx_service.generate_summary(text, level)
        key_points = watsonx_service.generate_key_points(text, level)
        terms      = watsonx_service.generate_difficult_terms(text, level)
        flashcards = watsonx_service.generate_flashcards(text, level)
        quiz       = watsonx_service.generate_quiz(text, level)
    except HTTPException:
        raise
    except Exception as exc:
        _watsonx_error_handler(exc)

    return SimplifyResponse(
        simplified_text=simplified,
        summary=summary,
        key_points=key_points,
        difficult_terms=terms,
        flashcards=flashcards,
        quiz=quiz,
    )


@router.post("/summary", response_model=SummaryResponse)
async def summary(request: SimplifyRequest):
    """Generate a 5-bullet-point summary of the provided content."""
    text, level = _validate_text_and_level(request.text, request.level)
    try:
        result = watsonx_service.generate_summary(text, level)
    except Exception as exc:
        _watsonx_error_handler(exc)
    return SummaryResponse(summary=result)


@router.post("/keypoints", response_model=KeyPointsResponse)
async def key_points(request: SimplifyRequest):
    """Extract the 10 most important key points from the content."""
    text, level = _validate_text_and_level(request.text, request.level)
    try:
        result = watsonx_service.generate_key_points(text, level)
    except Exception as exc:
        _watsonx_error_handler(exc)
    return KeyPointsResponse(key_points=result)


@router.post("/flashcards", response_model=FlashcardsResponse)
async def flashcards(request: SimplifyRequest):
    """Generate 10 study flashcards from the content."""
    text, level = _validate_text_and_level(request.text, request.level)
    try:
        result = watsonx_service.generate_flashcards(text, level)
    except Exception as exc:
        _watsonx_error_handler(exc)
    return FlashcardsResponse(flashcards=result)


@router.post("/quiz", response_model=QuizResponse)
async def quiz(request: SimplifyRequest):
    """Generate a 10-question multiple-choice quiz from the content."""
    text, level = _validate_text_and_level(request.text, request.level)
    try:
        result = watsonx_service.generate_quiz(text, level)
    except Exception as exc:
        _watsonx_error_handler(exc)
    return QuizResponse(quiz=result)
