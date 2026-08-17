"""
tests/test_goals.py

Automated test suite for User-Scoped Goal Authorization & Management.
Verifies goal creation, listing, detail reading, updating, and deletion are strictly user-scoped
and bound to Firebase authenticated requests.
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


def test_create_goal_for_authenticated_user():
    headers = {"X-Firebase-UID": "fb_user_alice"}
    with TestClient(app) as client:
        # 1. Sync user first
        sync_res = client.post("/api/v1/users/sync", json={
            "firebase_uid": "fb_user_alice",
            "email": "alice@example.com",
            "display_name": "Alice Developer"
        })
        assert sync_res.status_code == 200
        alice_id = sync_res.json()["id"]

        # 2. Create goal using X-Firebase-UID header
        goal_payload = {
            "title": "Master FastAPI & Firebase Auth",
            "description": "Build user-scoped goal tracking APIs",
            "status": "active"
        }
        res = client.post("/api/v1/goals/", json=goal_payload, headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["title"] == "Master FastAPI & Firebase Auth"
        assert data["description"] == "Build user-scoped goal tracking APIs"
        assert data["user_id"] == alice_id
        assert data["status"] == "active"


def test_user_scoped_goals_isolation():
    alice_headers = {"X-Firebase-UID": "fb_user_alice"}
    bob_headers = {"X-Firebase-UID": "fb_user_bob"}

    with TestClient(app) as client:
        # Sync Alice and Bob
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_alice", "email": "alice@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_bob", "email": "bob@example.com"})

        # Alice creates Goal 1
        res1 = client.post("/api/v1/goals/", json={"title": "Alice's Goal"}, headers=alice_headers)
        assert res1.status_code == 200

        # Bob creates Goal 2
        res2 = client.post("/api/v1/goals/", json={"title": "Bob's Goal"}, headers=bob_headers)
        assert res2.status_code == 200

        # Alice fetches goals -> sees ONLY Alice's Goal
        alice_goals_res = client.get("/api/v1/goals/", headers=alice_headers)
        assert alice_goals_res.status_code == 200
        alice_goals = alice_goals_res.json()
        assert len(alice_goals) == 1
        assert alice_goals[0]["title"] == "Alice's Goal"

        # Bob fetches goals -> sees ONLY Bob's Goal
        bob_goals_res = client.get("/api/v1/goals/", headers=bob_headers)
        assert bob_goals_res.status_code == 200
        bob_goals = bob_goals_res.json()
        assert len(bob_goals) == 1
        assert bob_goals[0]["title"] == "Bob's Goal"


def test_read_specific_goal_authorization():
    alice_headers = {"X-Firebase-UID": "fb_user_alice"}
    bob_headers = {"X-Firebase-UID": "fb_user_bob"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_alice", "email": "alice@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_bob", "email": "bob@example.com"})

        # Alice creates a goal
        goal_res = client.post("/api/v1/goals/", json={"title": "Secret Goal"}, headers=alice_headers)
        goal_id = goal_res.json()["id"]

        # Alice can access her own goal
        alice_read = client.get(f"/api/v1/goals/{goal_id}", headers=alice_headers)
        assert alice_read.status_code == 200
        assert alice_read.json()["title"] == "Secret Goal"

        # Bob cannot access Alice's goal (returns 404 Not Found)
        bob_read = client.get(f"/api/v1/goals/{goal_id}", headers=bob_headers)
        assert bob_read.status_code == 404
        assert bob_read.json()["detail"] == "Goal not found"


def test_update_goal_authorization():
    alice_headers = {"X-Firebase-UID": "fb_user_alice"}
    bob_headers = {"X-Firebase-UID": "fb_user_bob"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_alice", "email": "alice@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_bob", "email": "bob@example.com"})

        # Alice creates a goal
        goal_res = client.post("/api/v1/goals/", json={"title": "Draft Goal"}, headers=alice_headers)
        goal_id = goal_res.json()["id"]

        # Bob attempts to update Alice's goal -> 404 Not Found
        bob_update = client.put(
            f"/api/v1/goals/{goal_id}",
            json={"title": "Hacked Goal"},
            headers=bob_headers
        )
        assert bob_update.status_code == 404

        # Alice updates her goal -> 200 OK
        alice_update = client.put(
            f"/api/v1/goals/{goal_id}",
            json={"title": "Finalized Goal", "status": "completed"},
            headers=alice_headers
        )
        assert alice_update.status_code == 200
        assert alice_update.json()["title"] == "Finalized Goal"
        assert alice_update.json()["status"] == "completed"


def test_delete_goal_authorization():
    alice_headers = {"X-Firebase-UID": "fb_user_alice"}
    bob_headers = {"X-Firebase-UID": "fb_user_bob"}

    with TestClient(app) as client:
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_alice", "email": "alice@example.com"})
        client.post("/api/v1/users/sync", json={"firebase_uid": "fb_user_bob", "email": "bob@example.com"})

        # Alice creates a goal
        goal_res = client.post("/api/v1/goals/", json={"title": "Temporary Goal"}, headers=alice_headers)
        goal_id = goal_res.json()["id"]

        # Bob attempts to delete Alice's goal -> 404 Not Found
        bob_del = client.delete(f"/api/v1/goals/{goal_id}", headers=bob_headers)
        assert bob_del.status_code == 404

        # Alice deletes her goal -> 200 OK
        alice_del = client.delete(f"/api/v1/goals/{goal_id}", headers=alice_headers)
        assert alice_del.status_code == 200
        assert alice_del.json()["message"] == "Goal deleted successfully"

        # Verify goal is gone
        alice_read = client.get(f"/api/v1/goals/{goal_id}", headers=alice_headers)
        assert alice_read.status_code == 404


def test_demo_user_fallback():
    with TestClient(app) as client:
        # Request without auth headers falls back to demo_firebase_uid_123
        res = client.get("/api/v1/goals/")
        assert res.status_code == 200
        assert res.json() == []


def test_unauthenticated_unsynced_user():
    headers = {"X-Firebase-UID": "unknown_firebase_uid_999"}
    with TestClient(app) as client:
        res = client.get("/api/v1/goals/", headers=headers)
        assert res.status_code == 401
        assert "not found" in res.json()["detail"]
