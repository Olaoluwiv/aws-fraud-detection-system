
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base
from backend.main import app, get_db
from backend.models import TransactionDB


# Create a separate in-memory database for testing.
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


# Use the test database instead of the application database.
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    # Create tables in the test database.
    Base.metadata.create_all(bind=test_engine)

    # Override the application's database dependency.
    app.dependency_overrides[get_db] = override_get_db

    # Insert one sample transaction for predictable testing.
    db = TestingSessionLocal()
    try:
        db.add(
            TransactionDB(
                transaction_id="TEST-001",
                customer="Test Customer",
                merchant="Test Merchant",
                amount=100.0,
                currency="USD",
                type="Purchase",
                risk_level="Low",
                status="Approved",
                location="Usual",
            )
        )
        db.commit()
    finally:
        db.close()

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        # Restore dependencies and remove test tables.
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=test_engine)


def test_home_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to the VaultGuard API",
        "status": "running",
    }


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "VaultGuard API",
    }


def test_list_transactions_endpoint(client):
    response = client.get("/api/transactions")

    assert response.status_code == 200

    data = response.json()

    assert "count" in data
    assert "transactions" in data
    assert data["count"] == len(data["transactions"])
    assert data["count"] == 1

    transaction = data["transactions"][0]

    assert transaction["transaction_id"] == "TEST-001"
    assert transaction["amount"] == 100.0
    assert transaction["risk_level"] == "Low"
