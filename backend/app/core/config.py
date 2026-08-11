"""
config.py

Central configuration for the Gemini AI foundation.
Loads the API key from a .env file (never hardcode keys in source).
"""

import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini 2.5 Flash is the free-tier workhorse model (see Day 1 research):
# ~1,500 requests/day, up to 15 RPM on the free tier as of Aug 2026.
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")

# Low temperature for extraction tasks -> consistent, repeatable structured output.
EXTRACTION_TEMPERATURE = 0.0

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Copy .env.example to .env and add your "
        "key from Google AI Studio (https://aistudio.google.com/apikey)."
    )