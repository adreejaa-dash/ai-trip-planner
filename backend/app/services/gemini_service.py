"""
Gemini AI service — generates and refines structured travel itineraries.

Uses the Google Gemini API through google-genai SDK. All interactions are
validated through Pydantic models to ensure deterministic, structured output.
"""

from __future__ import annotations

import json
import logging
import re
from functools import lru_cache

from app.core.config import settings
from app.schemas.itinerary import (
    GeminiItinerary,
    GeminiActivity,
    GeminiBudgetBreakdown,
    GeminiDayPlan,
)

logger = logging.getLogger(__name__)


# ── Client singleton ──────────────────────────────────────────────────────────

@lru_cache
def _get_client():
    """Create a Gemini client. Raises if API key is not configured."""
    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. "
            "Get a key at https://aistudio.google.com/app/apikey "
            "and add it to backend/.env"
        )
    from google import genai  # type: ignore
    return genai.Client(api_key=settings.gemini_api_key)


# ── Prompt builders ───────────────────────────────────────────────────────────

def _build_generation_prompt(
    destination: str,
    duration: int,
    budget: float,
    currency: str,
    interests: list[str],
) -> str:
    interests_str = ", ".join(interests) if interests else "general sightseeing"
    currency_symbol = "₹" if currency == "INR" else currency

    return f"""You are TripPlanner, an expert travel planner. Generate a detailed, personalized travel itinerary.

USER PREFERENCES:
- Destination: {destination}
- Duration: {duration} days
- Total Budget: {currency_symbol}{budget:,.0f} ({currency})
- Interests: {interests_str}

CRITICAL RULES:
1. Generate exactly {duration} day(s) of activities.
2. All costs must be in {currency} ({currency_symbol}).
3. The total estimated cost in budget_breakdown MUST NOT exceed {currency_symbol}{budget:,.0f}.
4. Use REAL, SPECIFIC place names that actually exist in {destination}. Do NOT invent fictional locations.
5. Each day should have 3-5 activities with realistic times, real places, and estimated costs.
6. Activities should reflect the user's interests: {interests_str}.
7. Travel tips should be specific to {destination}, not generic filler.
8. Budget breakdown should be realistic and add up correctly.
9. Do NOT repeat the same attraction across different days.
10. Provide practical, actionable descriptions for each activity.

Respond ONLY with a valid JSON object (no markdown fences, no extra text) using this EXACT schema:

{{
  "destination": "{destination}",
  "summary": "2-3 sentence overview of the trip highlighting what makes {destination} special",
  "budget_breakdown": {{
    "accommodation": <number>,
    "food": <number>,
    "transportation": <number>,
    "activities": <number>,
    "miscellaneous": <number>,
    "total": <number that must be <= {budget}>
  }},
  "days": [
    {{
      "day": 1,
      "title": "Short evocative day title",
      "activities": [
        {{
          "time": "09:00 AM",
          "place": "Specific real place name",
          "activity": "What to do there",
          "description": "2-3 sentences with practical details",
          "estimated_cost": <number in {currency}>
        }}
      ]
    }}
  ],
  "travel_tips": [
    "Specific, practical tip about {destination}",
    "Tip about local transport",
    "Tip about food/cuisine",
    "Tip about best times to visit attractions",
    "Tip about local customs or useful info"
  ]
}}

Generate exactly {duration} days. Be honest and realistic — quality over quantity."""


def _build_refinement_prompt(
    existing_itinerary: dict,
    instruction: str,
    budget: float,
    currency: str,
) -> str:
    currency_symbol = "₹" if currency == "INR" else currency
    itinerary_json = json.dumps(existing_itinerary, indent=2, ensure_ascii=False)

    return f"""You are TripPlanner, an expert travel planner. The user wants to modify their existing itinerary.

EXISTING ITINERARY:
{itinerary_json}

USER'S MODIFICATION REQUEST:
"{instruction}"

RULES:
1. Modify ONLY what the user requested. Preserve everything else.
2. Keep the same destination and number of days unless the user explicitly asks to change them.
3. Keep the total budget under {currency_symbol}{budget:,.0f} ({currency}).
4. All costs must be in {currency}.
5. Use real place names — do NOT invent fictional locations.
6. Return the COMPLETE updated itinerary in the exact same JSON schema as the original.

Respond ONLY with a valid JSON object (no markdown fences, no extra text) using the same schema as the existing itinerary."""


# ── JSON extraction ───────────────────────────────────────────────────────────

def _extract_json(raw: str) -> dict:
    """
    Robustly extract the first complete JSON object from a model response.
    Handles markdown fences, trailing text, and comments.
    """
    # Strip markdown fences
    raw = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.MULTILINE)
    raw = re.sub(r"\s*```\s*$", "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    # Try direct parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Find first complete JSON object via brace counting
    start_idx = raw.find("{")
    if start_idx == -1:
        raise ValueError("No JSON object found in Gemini response")

    depth = 0
    in_string = False
    escape_next = False
    for i, ch in enumerate(raw[start_idx:], start=start_idx):
        if escape_next:
            escape_next = False
            continue
        if ch == "\\" and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return json.loads(raw[start_idx : i + 1])

    raise ValueError("Incomplete JSON object in Gemini response")


# ── Validation & budget enforcement ───────────────────────────────────────────

def _validate_itinerary(data: dict, expected_duration: int, budget: float) -> GeminiItinerary:
    """
    Validate Gemini response with Pydantic models.
    Enforce budget compliance and correct day count.
    """
    itinerary = GeminiItinerary.model_validate(data)

    # Verify day count
    if len(itinerary.days) != expected_duration:
        logger.warning(
            "Gemini returned %d days but expected %d — adjusting",
            len(itinerary.days), expected_duration,
        )
        # Trim or pad
        if len(itinerary.days) > expected_duration:
            itinerary.days = itinerary.days[:expected_duration]
        # Re-number days
        for i, day in enumerate(itinerary.days):
            day.day = i + 1

    # Enforce budget compliance
    if itinerary.budget_breakdown.total > budget:
        logger.warning(
            "Generated total %.0f exceeds budget %.0f — rescaling",
            itinerary.budget_breakdown.total, budget,
        )
        itinerary = _rescale_budget(itinerary, budget)

    # Validate day numbers are sequential
    for i, day in enumerate(itinerary.days):
        day.day = i + 1

    # Ensure all activity costs are non-negative
    for day in itinerary.days:
        for act in day.activities:
            if act.estimated_cost < 0:
                act.estimated_cost = 0

    return itinerary


def _rescale_budget(itinerary: GeminiItinerary, budget: float) -> GeminiItinerary:
    """Proportionally scale down the budget breakdown to fit within budget."""
    bb = itinerary.budget_breakdown
    if bb.total <= 0:
        return itinerary

    ratio = budget / bb.total
    bb.accommodation = round(bb.accommodation * ratio, 2)
    bb.food = round(bb.food * ratio, 2)
    bb.transportation = round(bb.transportation * ratio, 2)
    bb.activities = round(bb.activities * ratio, 2)
    bb.miscellaneous = round(bb.miscellaneous * ratio, 2)
    bb.total = round(bb.accommodation + bb.food + bb.transportation + bb.activities + bb.miscellaneous, 2)

    # Also scale activity costs
    for day in itinerary.days:
        for act in day.activities:
            act.estimated_cost = round(act.estimated_cost * ratio, 2)

    return itinerary


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_trip_itinerary(
    destination: str,
    duration: int,
    budget: float,
    currency: str,
    interests: list[str],
) -> GeminiItinerary:
    """
    Generate a complete trip itinerary using Gemini.
    Returns a validated GeminiItinerary.
    Raises RuntimeError on API key issues, ValueError on response parse failure.
    """
    client = _get_client()
    prompt = _build_generation_prompt(destination, duration, budget, currency, interests)

    logger.info(
        "Calling Gemini [model=%s] for %s (%d days, %s%.0f)",
        settings.gemini_model, destination, duration, currency, budget,
    )

    response = await client.aio.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    logger.info("Gemini responded (%d chars) — parsing and validating", len(response.text))
    raw_data = _extract_json(response.text)
    return _validate_itinerary(raw_data, duration, budget)


async def refine_trip_itinerary(
    existing_itinerary: dict,
    instruction: str,
    budget: float,
    currency: str,
    duration: int,
) -> GeminiItinerary:
    """
    Refine an existing itinerary based on user instruction.
    Returns a validated GeminiItinerary with the modifications applied.
    """
    client = _get_client()
    prompt = _build_refinement_prompt(existing_itinerary, instruction, budget, currency)

    logger.info("Calling Gemini for itinerary refinement: %r", instruction[:100])

    response = await client.aio.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response for refinement")

    logger.info("Gemini refinement responded (%d chars) — parsing and validating", len(response.text))
    raw_data = _extract_json(response.text)
    return _validate_itinerary(raw_data, duration, budget)
