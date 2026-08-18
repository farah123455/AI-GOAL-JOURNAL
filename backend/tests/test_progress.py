"""
tests/test_progress.py

Automated test suite for Progress Management API, user/goal scoping, and CRUD operations.
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


def test_create_and_read_progress():
    user1_headers = {"X-Firebase-UID": "user_111"}

    with TestClient(app) as client:
        # Sync User
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})

        # Create Goal
        g_resp = client.post(
            "/api/v1/goals/",
            json={"title": "Master Backend Integration", "description": "Build robust FastAPI APIs"},
            headers=user1_headers
        )
        assert g_resp.status_code == 200
        goal_id = g_resp.json()["id"]

        # Create Progress entry
        p_resp = client.post(
            "/api/v1/progress/",
            json={"goal_id": goal_id, "progress_value": 50, "note": "Halfway completed!"},
            headers=user1_headers
        )
        assert p_resp.status_code == 201
        p_data = p_resp.json()
        assert p_data["goal_id"] == goal_id
        assert p_data["progress_value"] == 50
        assert p_data["note"] == "Halfway completed!"

        # Read progress list
        list_resp = client.get("/api/v1/progress/", headers=user1_headers)
        assert list_resp.status_code == 200
        progress_list = list_resp.json()
        assert len(progress_list) == 1
        assert progress_list[0]["id"] == p_data["id"]


def test_progress_filtering_by_goal():
    headers = {"X-Firebase-UID": "user_111"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})

        # Create 2 goals
        g1_id = client.post("/api/v1/goals/", json={"title": "Goal 1"}, headers=headers).json()["id"]
        g2_id = client.post("/api/v1/goals/", json={"title": "Goal 2"}, headers=headers).json()["id"]

        # Create progress records
        client.post("/api/v1/progress/", json={"goal_id": g1_id, "progress_value": 25, "note": "G1 step 1"}, headers=headers)
        client.post("/api/v1/progress/", json={"goal_id": g1_id, "progress_value": 50, "note": "G1 step 2"}, headers=headers)
        client.post("/api/v1/progress/", json={"goal_id": g2_id, "progress_value": 100, "note": "G2 completed"}, headers=headers)

        # Filter by Goal 1
        g1_progress = client.get(f"/api/v1/progress/?goal_id={g1_id}", headers=headers).json()
        assert len(g1_progress) == 2

        # Filter by Goal 2
        g2_progress = client.get(f"/api/v1/progress/?goal_id={g2_id}", headers=headers).json()
        assert len(g2_progress) == 1
        assert g2_progress[0]["progress_value"] == 100


def test_progress_user_isolation():
    user1_headers = {"X-Firebase-UID": "user_111"}
    user2_headers = {"X-Firebase-UID": "user_222"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_222", "email": "user2@example.com"})

        # User 1 creates Goal
        g1_id = client.post("/api/v1/goals/", json={"title": "User 1 Goal"}, headers=user1_headers).json()["id"]

        # User 2 tries to post progress to User 1's goal -> 404
        unauth_p_resp = client.post(
            "/api/v1/progress/",
            json={"goal_id": g1_id, "progress_value": 99, "note": "Malicious update"},
            headers=user2_headers
        )
        assert unauth_p_resp.status_code == 404

        # User 1 posts legitimate progress
        auth_p_resp = client.post(
            "/api/v1/progress/",
            json={"goal_id": g1_id, "progress_value": 50, "note": "Legit progress"},
            headers=user1_headers
        )
        p_id = auth_p_resp.json()["id"]

        # User 2 tries to read User 1's progress -> 404
        assert client.get(f"/api/v1/progress/{p_id}", headers=user2_headers).status_code == 404

        # User 2 tries to update User 1's progress -> 404
        assert client.put(f"/api/v1/progress/{p_id}", json={"progress_value": 0}, headers=user2_headers).status_code == 404

        # User 2 tries to delete User 1's progress -> 404
        assert client.delete(f"/api/v1/progress/{p_id}", headers=user2_headers).status_code == 404


def test_update_and_delete_progress():
    headers = {"X-Firebase-UID": "user_111"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "user_111", "email": "user1@example.com"})
        g_id = client.post("/api/v1/goals/", json={"title": "Goal for Progress Update"}, headers=headers).json()["id"]

        p_id = client.post(
            "/api/v1/progress/",
            json={"goal_id": g_id, "progress_value": 10, "note": "Started"},
            headers=headers
        ).json()["id"]

        # Update progress
        update_resp = client.put(
            f"/api/v1/progress/{p_id}",
            json={"progress_value": 75, "note": "Great advancement!"},
            headers=headers
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["progress_value"] == 75
        assert update_resp.json()["note"] == "Great advancement!"

        # Delete progress
        del_resp = client.delete(f"/api/v1/progress/{p_id}", headers=headers)
        assert del_resp.status_code == 200

        # Verify 404
        assert client.get(f"/api/v1/progress/{p_id}", headers=headers).status_code == 404
