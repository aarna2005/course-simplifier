"""
services/watsonx_service.py
---------------------------
All IBM watsonx.ai Studio interactions live here.

Each public function builds a tailored prompt, calls the Foundation Model
via the official ibm-watsonx-ai SDK, and returns the structured result.

SDK objects used
  • ibm_watsonx_ai.Credentials  – wraps API key + URL
  • ibm_watsonx_ai.foundation_models.ModelInference – inference interface
  • model.chat()                 – generates text from a chat message list
"""

import json
import re
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

from config import settings

# ---------------------------------------------------------------------------
# Shared SDK client helpers
# ---------------------------------------------------------------------------

def _get_model() -> ModelInference:
    """
    Build and return a ModelInference instance using credentials from .env.
    A new instance is created per request to keep the service stateless.
    """
    credentials = Credentials(
        url=settings.watsonx_url,
        api_key=settings.watsonx_api_key,
    )
    model = ModelInference(
        model_id=settings.watsonx_model_id,
        project_id=settings.watsonx_project_id,
        credentials=credentials,
        params={
            GenParams.MAX_NEW_TOKENS: 3000,
            GenParams.TEMPERATURE: 0.3,
            GenParams.REPETITION_PENALTY: 1.1,
        },
    )
    return model


def _chat(system_prompt: str, user_message: str) -> str:
    """
    Send a chat request to the IBM Foundation Model and return the response
    text.  Uses the messages-style (chat) API.

    Args:
        system_prompt: Instructions for how the model should behave.
        user_message:  The actual content / question.

    Returns:
        The model's text response stripped of leading/trailing whitespace.
    """
    model = _get_model()
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user",   "content": user_message},
    ]
    response = model.chat(messages=messages)
    # Navigate the response structure returned by the SDK
    return response["choices"][0]["message"]["content"].strip()


def _extract_json(text: str) -> list:
    """
    Robustly extract the first JSON array from a model response.
    Falls back to an empty list if no valid JSON is found.

    Args:
        text: Raw model output that should contain a JSON array.

    Returns:
        Parsed Python list, or [] on failure.
    """
    # Try to find a JSON array in the text
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    # Attempt to parse the whole text as JSON
    try:
        result = json.loads(text)
        if isinstance(result, list):
            return result
    except json.JSONDecodeError:
        pass
    return []


# ---------------------------------------------------------------------------
# Public service functions
# ---------------------------------------------------------------------------

def simplify_content(text: str, level: str) -> str:
    """
    Rewrite the educational content at the specified learner level.

    Args:
        text:  Original educational content.
        level: Learner level (beginner, intermediate, high_school,
               undergraduate, engineering_student, expert).

    Returns:
        Simplified version of the content as a string.
    """
    level_descriptions = {
        "beginner":            "a complete beginner with no prior knowledge",
        "intermediate":        "someone with basic familiarity with the subject",
        "high_school":         "a high school student",
        "undergraduate":       "an undergraduate college student",
        "engineering_student": "an engineering student with strong technical background",
        "expert":              "an expert who wants a precise, technical explanation",
    }
    audience = level_descriptions.get(level, "a general learner")

    system_prompt = (
        "You are an expert educational content simplifier. "
        "Your job is to rewrite academic content so it is perfectly "
        "suited to the specified learner level. "
        "Rules you MUST follow:\n"
        "1. Preserve all headings exactly.\n"
        "2. Keep all mathematical formulas and equations unchanged.\n"
        "3. Do NOT change any factual meaning.\n"
        "4. Replace jargon with simpler language appropriate for the audience.\n"
        "5. Explain difficult concepts using analogies where helpful.\n"
        "6. Write in clear, engaging paragraphs.\n"
        "7. Return ONLY the simplified content, no preamble."
    )
    user_message = (
        f"Rewrite the following educational content for {audience}.\n\n"
        f"--- CONTENT START ---\n{text}\n--- CONTENT END ---"
    )
    return _chat(system_prompt, user_message)


def generate_summary(text: str, level: str) -> str:
    """
    Generate a concise 5-bullet-point summary of the content.

    Args:
        text:  Educational content to summarise.
        level: Learner level for appropriate language.

    Returns:
        Summary as a plain-text string with bullet points.
    """
    system_prompt = (
        "You are an educational summariser. "
        "Produce exactly 5 clear and concise bullet points summarising the "
        "main ideas of the provided content. "
        "Each bullet must start with '• '. "
        "Use language appropriate for the specified learner level. "
        "Return ONLY the 5 bullet points, nothing else."
    )
    user_message = (
        f"Learner level: {level}\n\n"
        f"Summarise the following content in 5 bullet points:\n\n{text}"
    )
    return _chat(system_prompt, user_message)


def generate_key_points(text: str, level: str) -> list[str]:
    """
    Extract the 10 most important key points from the content.

    Args:
        text:  Educational content.
        level: Learner level.

    Returns:
        List of up to 10 key-point strings.
    """
    system_prompt = (
        "You are an expert at identifying the most important concepts in "
        "educational material. "
        "Extract exactly 10 key points from the content provided. "
        "Each point must be a single, self-contained sentence. "
        "Number each point 1–10. "
        "Use language appropriate for the specified learner level. "
        "Return ONLY the numbered list, nothing else."
    )
    user_message = (
        f"Learner level: {level}\n\n"
        f"Extract the 10 most important key points from:\n\n{text}"
    )
    raw = _chat(system_prompt, user_message)

    # Split numbered lines into a clean list
    points = []
    for line in raw.splitlines():
        line = line.strip()
        # Remove leading numbers like "1." or "1)"
        cleaned = re.sub(r"^\d+[\.\)]\s*", "", line)
        if cleaned:
            points.append(cleaned)
    return points[:10]


def generate_difficult_terms(text: str, level: str) -> list[dict]:
    """
    Identify difficult terms and provide simple explanations.

    Args:
        text:  Educational content.
        level: Learner level.

    Returns:
        List of dicts with keys 'term' and 'explanation'.
    """
    system_prompt = (
        "You are a vocabulary expert for educational content. "
        "Identify up to 10 difficult or technical terms in the content that "
        "might be hard for the specified learner level to understand. "
        "For each term provide a simple, clear explanation. "
        "Return a JSON array ONLY, with no extra text, in this exact format:\n"
        '[{"term": "Term", "explanation": "Simple explanation..."}]'
    )
    user_message = (
        f"Learner level: {level}\n\n"
        f"Identify difficult terms and explain them from:\n\n{text}"
    )
    raw = _chat(system_prompt, user_message)
    terms = _extract_json(raw)

    # Validate / normalise structure
    result = []
    for item in terms:
        if isinstance(item, dict) and "term" in item and "explanation" in item:
            result.append({"term": item["term"], "explanation": item["explanation"]})
    return result


def generate_flashcards(text: str, level: str) -> list[dict]:
    """
    Generate 10 study flashcards from the educational content.

    Args:
        text:  Educational content.
        level: Learner level.

    Returns:
        List of dicts with keys 'front' (question) and 'back' (answer).
    """
    system_prompt = (
        "You are a flashcard creator for students. "
        "Create exactly 10 flashcards based on the most important concepts "
        "in the provided educational content. "
        "Each flashcard must have a question on the front and a concise answer "
        "on the back. "
        "Use language appropriate for the specified learner level. "
        "Return a JSON array ONLY with no extra text, in this exact format:\n"
        '[{"front": "Question?", "back": "Answer."}]'
    )
    user_message = (
        f"Learner level: {level}\n\n"
        f"Create 10 flashcards from:\n\n{text}"
    )
    raw = _chat(system_prompt, user_message)
    cards = _extract_json(raw)

    # Validate / normalise structure
    result = []
    for item in cards:
        if isinstance(item, dict) and "front" in item and "back" in item:
            result.append({"front": item["front"], "back": item["back"]})
    return result


def generate_quiz(text: str, level: str) -> list[dict]:
    """
    Generate a 10-question multiple-choice quiz from the content.

    Args:
        text:  Educational content.
        level: Learner level.

    Returns:
        List of dicts with keys: question, option_a, option_b, option_c,
        option_d, correct_answer.
    """
    system_prompt = (
        "You are a quiz creator for educational assessments. "
        "Create exactly 10 multiple-choice questions based on the provided "
        "educational content. "
        "Each question must have 4 options (A, B, C, D) and one correct answer. "
        "The difficulty should match the specified learner level. "
        "Return a JSON array ONLY with no extra text, in this exact format:\n"
        "[\n"
        "  {\n"
        '    "question": "Question text?",\n'
        '    "option_a": "First option",\n'
        '    "option_b": "Second option",\n'
        '    "option_c": "Third option",\n'
        '    "option_d": "Fourth option",\n'
        '    "correct_answer": "A"\n'
        "  }\n"
        "]"
    )
    user_message = (
        f"Learner level: {level}\n\n"
        f"Create a 10-question MCQ quiz from:\n\n{text}"
    )
    raw = _chat(system_prompt, user_message)
    questions = _extract_json(raw)

    # Validate / normalise structure
    required_keys = {"question", "option_a", "option_b", "option_c", "option_d", "correct_answer"}
    result = []
    for item in questions:
        if isinstance(item, dict) and required_keys.issubset(item.keys()):
            result.append({k: item[k] for k in required_keys})
    return result
