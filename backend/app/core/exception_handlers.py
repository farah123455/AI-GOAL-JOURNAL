"""
app/core/exception_handlers.py

Centralized FastAPI exception handlers for application exceptions,
validation errors, and unexpected server errors.
"""

import logging
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.exceptions import AppException

logger = logging.getLogger("ai_goal_journal.exceptions")


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """
    Handles custom AppException and formats consistent JSON error response.
    """
    content = {
        "detail": exc.message,
        "error_code": exc.error_code
    }
    if exc.details is not None:
        content["details"] = exc.details

    return JSONResponse(
        status_code=exc.status_code,
        content=content
    )


async def custom_http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Normalizes standard FastAPI HTTPExceptions while preserving backward compatibility.
    """
    content = {
        "detail": exc.detail
    }
    if hasattr(exc, "headers") and exc.headers:
        return JSONResponse(
            status_code=exc.status_code,
            content=content,
            headers=exc.headers
        )
    return JSONResponse(
        status_code=exc.status_code,
        content=content
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handles Pydantic request validation errors with clean structured output.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Request validation failed",
            "error_code": "VALIDATION_ERROR",
            "errors": exc.errors()
        }
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for unhandled server exceptions to prevent raw tracebacks from leaking.
    """
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected internal server error occurred",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )
