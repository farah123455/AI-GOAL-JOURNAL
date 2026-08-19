"""
tests/test_architecture.py

Automated test suite verifying centralized exception handling, OpenAPI/Swagger docs generation,
and backend API quality standards.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import engine, Base


@pytest.fixture(autouse=True)
def setup_database():
    """Reset and initialize database tables before each test."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_root_and_user_health_endpoints():
    with TestClient(app) as client:
        # Root health check
        root_resp = client.get("/")
        assert root_resp.status_code == 200
        root_data = root_resp.json()
        assert root_data["status"] == "online"
        assert root_data["version"] == "1.0.0"

        # Users router health check
        user_health_resp = client.get("/api/v1/users/health")
        assert user_health_resp.status_code == 200
        assert user_health_resp.json()["status"] == "online"


def test_openapi_documentation_generation():
    with TestClient(app) as client:
        openapi_resp = client.get("/openapi.json")
        assert openapi_resp.status_code == 200
        schema = openapi_resp.json()
        assert schema["info"]["title"] == "AI Goal Journal API"
        assert "paths" in schema
        assert "/api/v1/goals/" in schema["paths"]
        assert "/api/v1/journals/" in schema["paths"]
        assert "/api/v1/progress/" in schema["paths"]
        assert "/api/v1/users/me" in schema["paths"]


def test_centralized_not_found_exception_format():
    headers = {"X-Firebase-UID": "arch_test_user"}

    with TestClient(app) as client:
        # Non-existent goal -> 404 with structured error_code
        g_resp = client.get("/api/v1/goals/99999", headers=headers)
        assert g_resp.status_code == 404
        g_data = g_resp.json()
        assert "detail" in g_data
        assert g_data["error_code"] == "RESOURCE_NOT_FOUND"

        # Non-existent journal -> 404 with structured error_code
        j_resp = client.get("/api/v1/journals/99999", headers=headers)
        assert j_resp.status_code == 404
        assert j_resp.json()["error_code"] == "RESOURCE_NOT_FOUND"

        # Non-existent progress -> 404 with structured error_code
        p_resp = client.get("/api/v1/progress/99999", headers=headers)
        assert p_resp.status_code == 404
        assert p_resp.json()["error_code"] == "RESOURCE_NOT_FOUND"


def test_centralized_validation_exception_format():
    headers = {"X-Firebase-UID": "arch_test_user"}

    with TestClient(app) as client:
        # Invalid progress payload (missing required goal_id & progress_value)
        p_resp = client.post("/api/v1/progress/", json={}, headers=headers)
        assert p_resp.status_code == 422
        p_data = p_resp.json()
        assert p_data["error_code"] == "VALIDATION_ERROR"
        assert "errors" in p_data
