"""
tests/test_journals.py

Automated test suite for Journal Management API, user isolation, and CRUD operations.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import engine, Base


@pytest.fixture(autouse=True)
def setup_database():
    """
    Reset and initialize database tables before each test.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_create_and_read_journals():
    user1_headers = {"X-Firebase-UID": "user_111"}
    user2_headers = {"X-Firebase-UID": "user_222"}

    with TestClient(app) as client:
        # Sync User 1 & User 2
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_222", "email": "user2@example.com"})

        # User 1 creates 2 journals
        j1_resp = client.post(
            "/api/v1/journals/",
            json={"title": "Day 1 Reflections", "content": "Learned FastAPI and Pydantic today."},
            headers=user1_headers
        )
        assert j1_resp.status_code == 201
        j1_data = j1_resp.json()
        assert j1_data["title"] == "Day 1 Reflections"
        assert j1_data["content"] == "Learned FastAPI and Pydantic today."

        j2_resp = client.post(
            "/api/v1/journals/",
            json={"title": "Day 2 Planning", "content": "Focusing on backend integration."},
            headers=user1_headers
        )
        assert j2_resp.status_code == 201

        # User 2 creates 1 journal
        j3_resp = client.post(
            "/api/v1/journals/",
            json={"title": "User 2 Entry", "content": "Private journal entry."},
            headers=user2_headers
        )
        assert j3_resp.status_code == 201

        # User 1 lists journals -> should get exactly 2
        u1_list_resp = client.get("/api/v1/journals/", headers=user1_headers)
        assert u1_list_resp.status_code == 200
        u1_journals = u1_list_resp.json()
        assert len(u1_journals) == 2

        # User 2 lists journals -> should get exactly 1
        u2_list_resp = client.get("/api/v1/journals/", headers=user2_headers)
        assert u2_list_resp.status_code == 200
        u2_journals = u2_list_resp.json()
        assert len(u2_journals) == 1
        assert u2_journals[0]["title"] == "User 2 Entry"


def test_journal_user_isolation():
    user1_headers = {"X-Firebase-UID": "user_111"}
    user2_headers = {"X-Firebase-UID": "user_222"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_222", "email": "user2@example.com"})

        # User 1 creates journal
        j1_resp = client.post(
            "/api/v1/journals/",
            json={"title": "Secret Notes", "content": "Top secret content."},
            headers=user1_headers
        )
        journal_id = j1_resp.json()["id"]

        # User 2 tries to read User 1's journal -> 404
        read_resp = client.get(f"/api/v1/journals/{journal_id}", headers=user2_headers)
        assert read_resp.status_code == 404

        # User 2 tries to update User 1's journal -> 404
        update_resp = client.put(
            f"/api/v1/journals/{journal_id}",
            json={"title": "Hacked Title"},
            headers=user2_headers
        )
        assert update_resp.status_code == 404

        # User 2 tries to delete User 1's journal -> 404
        delete_resp = client.delete(f"/api/v1/journals/{journal_id}", headers=user2_headers)
        assert delete_resp.status_code == 404

        # Verify User 1 can still access the journal unmodified
        verify_resp = client.get(f"/api/v1/journals/{journal_id}", headers=user1_headers)
        assert verify_resp.status_code == 200
        assert verify_resp.json()["title"] == "Secret Notes"


def test_update_and_delete_journal():
    headers = {"X-Firebase-UID": "user_111"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})

        j_resp = client.post(
            "/api/v1/journals/",
            json={"title": "Original Title", "content": "Original Content"},
            headers=headers
        )
        j_id = j_resp.json()["id"]

        # Update
        put_resp = client.put(
            f"/api/v1/journals/{j_id}",
            json={"title": "Updated Title"},
            headers=headers
        )
        assert put_resp.status_code == 200
        assert put_resp.json()["title"] == "Updated Title"
        assert put_resp.json()["content"] == "Original Content"

        # Delete
        del_resp = client.delete(f"/api/v1/journals/{j_id}", headers=headers)
        assert del_resp.status_code == 200

        # Verify 404 after deletion
        get_resp = client.get(f"/api/v1/journals/{j_id}", headers=headers)
        assert get_resp.status_code == 404
