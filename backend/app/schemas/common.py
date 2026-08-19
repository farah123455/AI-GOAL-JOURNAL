"""
app/schemas/common.py

Common reusable Pydantic schemas for generic API responses, status messages, and errors.
"""

from typing import Optional, Any
from pydantic import BaseModel, Field


class MessageResponse(BaseModel):
    """Generic message response schema for operations like delete."""
    message: str = Field(..., description="Status or result message", json_schema_extra={"example": "Goal deleted successfully"})


class ErrorResponse(BaseModel):
    """Standardized error response schema."""
    detail: str = Field(..., description="Error message detail", json_schema_extra={"example": "Resource not found"})
    error_code: Optional[str] = Field(None, description="Application specific error code", json_schema_extra={"example": "RESOURCE_NOT_FOUND"})
    details: Optional[Any] = Field(None, description="Additional contextual details")
