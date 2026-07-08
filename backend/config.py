"""
config.py
---------
Loads all environment variables from .env and exposes them as a
typed Settings object consumed by the rest of the application.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment / .env file."""

    # IBM watsonx.ai credentials
    watsonx_api_key: str
    watsonx_project_id: str
    watsonx_url: str = "https://us-south.ml.cloud.ibm.com"
    watsonx_model_id: str = "meta-llama/llama-3-3-70b-instruct"

    # FastAPI settings
    app_title: str = "Course Simplification Agent"
    app_version: str = "1.0.0"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",   # Vite dev server (fallback)
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


# Singleton instance used across the app
settings = Settings()
