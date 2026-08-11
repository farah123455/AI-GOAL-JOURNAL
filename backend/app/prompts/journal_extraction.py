"""
prompts.py

Builds the journal-analysis extraction prompt.

Applies the Day 1 / Day 2 research decisions:
- Explicit role/context framing
- Delimiters (XML-style tag) around the raw journal text
- Explicit JSON schema, "return only valid JSON"
- Classify statements PAST/COMPLETED, ONGOING, or FUTURE/INTENDED before
  extracting (the single hardest part of this pipeline per the research)
- Explicit constraints against inferring aspirational goals from passing
  mentions (anti-hallucination)
- Existing goals passed in as context so the model can do goal matching
  (is_new / matched_existing_goal_id) instead of extracting in isolation
"""

SYSTEM_INSTRUCTION = """\
You are analyzing a personal journal entry to extract structured
goal-tracking data for a productivity coaching app. You are precise,
conservative, and never invent information that is not supported by
the entry text.
"""

JSON_SCHEMA_INSTRUCTIONS = """\
Return ONLY valid JSON matching exactly this schema. No markdown fences,
no commentary, no text before or after the JSON object.

{
  "mood": "positive | neutral | negative",
  "mood_confidence": 0.0,
  "activities": [
    {
      "text": "string",
      "status": "completed | ongoing | planned",
      "related_goal_hint": "string or null"
    }
  ],
  "goals": [
    {
      "text": "string",
      "is_new": true,
      "matched_existing_goal_id": "string or null"
    }
  ],
  "blockers": [
    {
      "text": "string",
      "category_hint": "string"
    }
  ]
}
"""

INSTRUCTIONS = """\
Follow these steps:

1. Read the journal entry inside the <journal_entry> tags below.
2. Internally classify each relevant statement as PAST/COMPLETED,
   ONGOING, or FUTURE/INTENDED. Do not include this classification step
   in your output — use it only to decide status fields correctly.
3. Extract only what the user explicitly stated. Do NOT infer
   aspirational goals from passing mentions, and do NOT invent goals,
   activities, or blockers the entry does not support.
4. For each goal you extract, compare it against the user's EXISTING
   GOALS listed below. If it matches an existing goal (same underlying
   objective, even if worded differently), set "is_new": false and
   "matched_existing_goal_id" to that goal's id. Otherwise set
   "is_new": true and "matched_existing_goal_id": null.
5. Treat blockers as their own category — anything the user describes
   as preventing progress (e.g. "didn't have time", "kept getting
   distracted", "waiting on approval"). Do not fold them into activities.
6. Assign one overall "mood" for the entry with a "mood_confidence"
   between 0 and 1. Keep this descriptive, not diagnostic — this is a
   personal journaling feature, not a clinical assessment.
7. Output ONLY the JSON object described above.
"""


def build_extraction_prompt(entry_text: str, existing_goals: list[dict] | None = None) -> str:
    """
    Build the full user-turn prompt for a single journal-entry extraction call.

    existing_goals: list of {"id": str, "text": str} dicts representing the
    user's current active goal list, used for goal matching (see Day 1/2
    research on why extraction must be goal-aware, not entry-isolated).
    """
    existing_goals = existing_goals or []

    if existing_goals:
        goals_block = "\n".join(f'- id="{g["id"]}": {g["text"]}' for g in existing_goals)
    else:
        goals_block = "(none yet — this user has no existing goals on record)"

    return f"""\
{INSTRUCTIONS}

EXISTING GOALS:
{goals_block}

{JSON_SCHEMA_INSTRUCTIONS}

<journal_entry>
{entry_text.strip()}
</journal_entry>
"""
