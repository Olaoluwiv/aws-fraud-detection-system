
from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to the VaultGuard API",
        "status": "running",
    }


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "VaultGuard API",
    }


def test_list_transactions_endpoint():
    response = client.get("/api/transactions")

    assert response.status_code == 200

    data = response.json()

    assert "count" in data
    assert "transactions" in data
    assert data["count"] == len(data["transactions"])
    assert data["count"] > 0

    first_transaction = data["transactions"][0]

    assert "transaction_id" in first_transaction
    assert "amount" in first_transaction
    assert "risk_level" in first_transaction
