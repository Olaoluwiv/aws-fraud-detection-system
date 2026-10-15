
from backend.database import Base, SessionLocal, engine
from backend.models import TransactionDB

# Create database tables if they do not exist.
Base.metadata.create_all(bind=engine)

# Sample transactions for the VaultGuard demonstration.
sample_transactions = [
    {
        "transaction_id": "TXN-1001",
        "customer": "CUS-208",
        "merchant": "Northstar Market",
        "amount": 250.00,
        "currency": "USD",
        "type": "Online purchase",
        "risk_level": "Low",
        "status": "Approved",
        "location": "Usual",
    },
    {
        "transaction_id": "TXN-1002",
        "customer": "CUS-112",
        "merchant": "Metro Electronics",
        "amount": 4500.00,
        "currency": "USD",
        "type": "Online purchase",
        "risk_level": "High",
        "status": "Under Review",
        "location": "Unusual",
    },
    {
        "transaction_id": "TXN-1003",
        "customer": "CUS-451",
        "merchant": "City Transit",
        "amount": 89.99,
        "currency": "EUR",
        "type": "Point-of-sale",
        "risk_level": "Low",
        "status": "Approved",
        "location": "Usual",
    },
]

# Open a database session.
db = SessionLocal()

try:
    for item in sample_transactions:
        existing = db.get(
            TransactionDB,
            item["transaction_id"],
        )

        if existing is None:
            db.add(TransactionDB(**item))

    db.commit()
    print("VaultGuard database initialized successfully.")
    print("Sample transactions saved successfully.")

except Exception:
    db.rollback()
    raise

finally:
    db.close()
