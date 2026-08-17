"""
tests/test_users.py

Automated test suite for User Management API, Firebase UID mapping, Profile, and Preferences.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import engine, Base


@pytest.fixture(autouse=True)
def setup_database():
    """
    Ensure database tables are initialized before running tests.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_users_health():
    with TestClient(app) as client:
        response = client.get("/api/v1/users/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert data["service"] == "users_router"


def test_sync_user():
    payload = {
        "firebase_uid": "test_fb_uid_999",
        "email": "aditya.test@example.com",
        "display_name": "Aditya Verlekar",
        "profession": "Software Engineer",
        "bio": "Building AI Goal Journal",
        "timezone": "Asia/Kolkata",
        "preferences": {
            "theme": "dark",
            "daily_reminder_time": "21:00",
            "ai_coaching_tone": "analytical",
            "focus_areas": ["Engineering", "Productivity"],
            "email_notifications": True,
            "push_notifications": False
        }
    }
    with TestClient(app) as client:
        response = client.post("/api/v1/users/sync", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["firebase_uid"] == "test_fb_uid_999"
        assert data["email"] == "aditya.test@example.com"
        assert data["display_name"] == "Aditya Verlekar"
        assert data["preferences"]["theme"] == "dark"


def test_get_current_user_profile():
    headers = {"X-Firebase-UID": "test_fb_uid_999"}
    with TestClient(app) as client:
        # Sync user first
        client.post("/api/v1/users/sync", json={
            "firebase_uid": "test_fb_uid_999",
            "email": "aditya.test@example.com",
            "display_name": "Aditya Verlekar"
        })
        response = client.get("/api/v1/users/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["firebase_uid"] == "test_fb_uid_999"
        assert data["display_name"] == "Aditya Verlekar"


def test_update_user_profile():
    headers = {"X-Firebase-UID": "test_fb_uid_999"}
    update_payload = {
        "display_name": "Aditya V. (Updated)",
        "profession": "Lead Backend Engineer",
        "bio": "Empowering productivity with AI."
    }
    with TestClient(app) as client:
        # Sync user first
        client.post("/api/v1/users/sync", json={
            "firebase_uid": "test_fb_uid_999",
            "email": "aditya.test@example.com",
            "display_name": "Aditya Verlekar"
        })
        response = client.put("/api/v1/users/me", json=update_payload, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["display_name"] == "Aditya V. (Updated)"
        assert data["profession"] == "Lead Backend Engineer"
        assert data["bio"] == "Empowering productivity with AI."


def test_update_user_preferences():
    headers = {"X-Firebase-UID": "test_fb_uid_999"}
    pref_payload = {
        "preferences": {
            "theme": "light",
            "daily_reminder_time": "08:00",
            "ai_coaching_tone": "encouraging",
            "focus_areas": ["Health", "Coding", "Mindfulness"],
            "email_notifications": False,
            "push_notifications": True
        }
    }
    with TestClient(app) as client:
        # Sync user first
        client.post("/api/v1/users/sync", json={
            "firebase_uid": "test_fb_uid_999",
            "email": "aditya.test@example.com",
            "display_name": "Aditya Verlekar"
        })
        response = client.put("/api/v1/users/me/preferences", json=pref_payload, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["preferences"]["theme"] == "light"
        assert data["preferences"]["daily_reminder_time"] == "08:00"
        assert "Mindfulness" in data["preferences"]["focus_areas"]
