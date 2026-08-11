"""
gemini_service.py

Basic AI service module wrapping the Gemini API (google-genai SDK, the
current unified SDK — the older google-generativeai package is deprecated).

Usage:
    from gemini_service import GeminiService

    service = GeminiService()
    result = service.extract_from_journal("Today I went for a run...")
"""

import json

from google import genai
from google.genai import types

from app.core.config import GEMINI_API_KEY, GEMINI_MODEL_NAME, EXTRACTION_TEMPERATURE
from app.prompts.journal_extraction import SYSTEM_INSTRUCTION, build_extraction_prompt


class GeminiExtractionError(Exception):
    """Raised when Gemini returns a response that isn't valid/parseable JSON."""


class GeminiService:
    def __init__(self, model_name: str = GEMINI_MODEL_NAME):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model_name = model_name

    def extract_from_journal(
        self,
        entry_text: str,
        existing_goals: list[dict] | None = None,
    ) -> dict:
        """
        Send one journal entry to Gemini and return the parsed structured
        extraction (mood, activities, goals, blockers) as a Python dict.

        Raises GeminiExtractionError if the model does not return valid JSON.
        """
        prompt = build_extraction_prompt(entry_text, existing_goals)

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=EXTRACTION_TEMPERATURE,
                response_mime_type="application/json",
            ),
        )

        raw_text = response.text

        try:
            return json.loads(raw_text)
        except (json.JSONDecodeError, TypeError) as exc:
            raise GeminiExtractionError(
                f"Gemini did not return valid JSON.\nRaw response:\n{raw_text}"
            ) from exc